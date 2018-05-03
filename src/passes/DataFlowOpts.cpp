#include <wasm-printing.h>
/*
 * Copyright 2018 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//
// Optimize using the DataFlow SSA IR.
//
// This needs 'flatten' to be run before it, and you should run full
// regular opts afterwards to clean up the flattening. For example,
// you might use it like this:
//
//    --flatten --dfo -Os
//

#include "wasm.h"
#include "pass.h"
#include "wasm-builder.h"
#include "ir/utils.h"
#include "dataflow/node.h"
#include "dataflow/graph.h"
#include "dataflow/utils.h"

namespace wasm {

struct DataFlowOpts : public WalkerPass<PostWalker<DataFlowOpts>> {
  bool isFunctionParallel() override { return true; }

  Pass* create() override { return new DataFlowOpts; }

  // nodeUsers[x] = { y, z, .. }
  // where y, z etc. are nodes that use x, that is, x is in their
  // values vector.
  std::unordered_map<DataFlow::Node*, std::unordered_set<DataFlow::Node*>> nodeUsers;

  // The optimization work left to do: nodes that we need to look at.
  std::unordered_set<DataFlow::Node*> workLeft;

  DataFlow::Graph graph;

  void doWalkFunction(Function* func) {
    // Build the data-flow IR.
    graph.build(func);
dump(graph, std::cout);
    // Generate the uses between the nodes.
    for (auto& node : graph.nodes) {
      for (auto* value : node->values) {
        nodeUsers[value].insert(node.get());
      }
    }
    // Propagate optimizations through the graph.
    std::unordered_set<DataFlow::Node*> optimized; // which nodes we optimized
    for (auto& node : graph.nodes) {
      workLeft.insert(node.get()); // we should try to optimize each node
    }
    while (!workLeft.empty()) {
      auto iter = workLeft.begin();
      auto* node = *iter;
      workLeft.erase(iter);
      workOn(node);
    }
    // After updating the DataFlow IR, we can update the sets in
    // the wasm.
    for (auto* set : graph.sets) {
      auto* node = graph.setNodeMap[set];
      auto iter = optimized.find(node);
      if (iter != optimized.end()) {
        set->value = regenerate(node);
      }
    }
  }

  void workOn(DataFlow::Node* node) {
    if (node->isConst()) return;
    // If there are no uses, there is no point to work.
    auto iter = nodeUsers.find(node);
    if (iter == nodeUsers.end()) return;
    if (iter->second.empty()) return;
    // Optimize: Look for nodes that we can easily convert into
    // something simpler.
    // TODO: we can expressionify and run full normal opts on that,
    //       then copy the result if it's smaller.
    if (node->isPhi() && DataFlow::allInputsIdentical(node)) {
      // Note we don't need to check for effects when replacing, as in
      // flattened IR expression children are get_locals or consts.
      auto* value = node->getValue(1);
      if (value->isConst()) {
        replaceAllUsesWith(node, value);
      }
    } else if (node->isExpr() && DataFlow::allInputsConstant(node)) {
      assert(!node->isConst());
      // If this is a concrete value (not e.g. an eqz of unreachable),
      // it can definitely be precomputed into a constant.
      if (isConcreteType(node->expr->type)) {
        // This can be precomputed.
        // TODO not just all-constant inputs? E.g. i32.mul of 0 and X.
        optimizeExprToConstant(node);
      }
    }
  }

  void optimizeExprToConstant(DataFlow::Node* node) {
std::cout << "will optimize an Expr of all constant inputs. before" << '\n';
dump(node, std::cout);
std::cout << node->expr << '\n';
    auto* expr = node->expr;
    // First, note that some of the expression's children may be
    // get_locals that we inferred during SSA analysis as constant.
    // We can apply those now.
    for (Index i = 0; i < node->values.size(); i++) {
      if (node->values[i]->isConst()) {
        auto* currp = getIndexPointer(expr, i);
        if (!(*currp)->is<Const>()) {
          // Directly represent it as a constant.
std::cout << "constantize\n";
          auto* c = node->values[i]->expr->dynCast<Const>();
          *currp = Builder(*getModule()).makeConst(c->value);
        }
      }
    }
std::cout << "mid\n";
dump(node, std::cout);
std::cout << node->expr << '\n';
    // Now we know that all our DataFlow inputs are constant, and all
    // our Binaryen IR representations of them are constant too. RUn
    // precompute, which will transform the expression into a constanat.
    Module temp;
    Builder builder(temp);
    auto* func = builder.makeFunction("temp", std::vector<Type>{}, none, std::vector<Type>{}, expr);
    PassRunner runner(&temp);
    runner.setIsNested(true);
    runner.add("precompute");
    runner.runOnFunction(func);
    node->expr = func->body;
    assert(node->isConst());
    // We no longer have values, and so do not use anything.
    for (auto* value : node->values) {
      nodeUsers[value].erase(node);
    }
    node->values.clear();
std::cout << "after\n";
dump(node, std::cout);
std::cout << node->expr << '\n';
    // Our contents changed, update our users.
    replaceAllUsesWith(node, node);
  }

  // Replaces all uses of a node with another value. This both modifies
  // the DataFlow IR to make the other users point to this one, and
  // updates the underlying Binaryen IR as well.
  // This can be used to "replace" a node with itself, which makes sense
  // when the node contents have changed and so the users must be updated.
  void replaceAllUsesWith(DataFlow::Node* node, DataFlow::Node* with) {
std::cout << "raUW1\n";
dump(node, std::cout);
    // Const nodes are trivial to replace, but other stuff is trickier -
    // in particular phis.
    assert(with->isConst()); // TODO
    // All the users should be worked on later, as we will update them.
    auto& users = nodeUsers[node];
std::cout << "raUW2\n";
    for (auto* user : users) {
std::cout << "a user:\n";
dump(user, std::cout);
      // Add the user to the work left to do, as we are modifying it.
      workLeft.insert(user);
      // `with` is getting another user.
      nodeUsers[with].insert(user);
      // Replacing in the DataFlow IR is simple - just replace it,
      // in all the indexes it appears.
std::cout << "update user\n";
      std::vector<Index> indexes;
      for (Index i = 0; i < user->values.size(); i++) {
        if (user->values[i] == node) {
          user->values[i] = with;
          indexes.push_back(i);
std::cout << "index: " << i << "\n";
        }
      }
      assert(!indexes.empty());
      // Replacing in the Binaryen IR requires more care
      switch (user->type) {
        case DataFlow::Node::Type::Expr: {
          auto* expr = user->expr;
          for (auto index : indexes) {
            *(getIndexPointer(expr, index)) = makeUse(with);
          }
std::cout << "after " << user->expr << '\n';
          break;
        }
        case DataFlow::Node::Type::Phi: {
          // Nothing to do: a phi is not in the Binaryen IR.
          // If the entire phi can become a constant, that will be
          // propagated when we process that phi later.
          break;
        }
        case DataFlow::Node::Type::Cond: {
          // Nothing to do: a cond is not in the Binaryen IR.
          // If the cond input is a constant, that might indicate
          // useful optimizations are possible, which perhaps we
          // should look into TODO
          break;
        }
        case DataFlow::Node::Type::Zext: {
          // Nothing to do: a cond is not in the Binaryen IR.
          // If the cond input is a constant, that might indicate
          // useful optimizations are possible, which perhaps we
          // should look into TODO
          break;
        }
        default:
std::cout << "p4\n";
 WASM_UNREACHABLE();
      }
    }
    // No one is a user of this node after we replaced all the uses.
    users.clear();
  }

  // Creates an expression that uses a node. Generally, a node represents
  // a value in a local, so we create a get_local for it.
  Expression* makeUse(DataFlow::Node* node) {
std::cout << "make a use of ";
dump(node, std::cout);
    Builder builder(*getModule());
    if (node->isPhi()) {
      // The index is the wasm local that we assign to when implementing
      // the phi; get from there.
      auto index = node->index;
      return builder.makeGetLocal(index, getFunction()->getLocalType(index));
    } else if (node->isConst()) {
      return builder.makeConst(node->expr->cast<Const>()->value);
    } else if (node->isExpr()) {
      // Find the set we are a value of.
      auto index = graph.getSet(node)->index;
std::cout << "making a use of an expression which was set to local " << index << '\n';
      return builder.makeGetLocal(index, getFunction()->getLocalType(index));
    } else {
std::cout << "p5\n";
dump(node, std::cout);
      WASM_UNREACHABLE(); // TODO
    }
  }

  // Given a node, regenerate an expression for it that can fit in a
  // the set_local for that node.
  Expression* regenerate(DataFlow::Node* node) {
    if (node->isExpr()) {
      // TODO: do we need to look deeply?
      return node->expr;
    }
    // This is not an expression, so we just need to use it.
    return makeUse(node);
  }

  // Gets a pointer to the expression pointer in an expression.
  // That is, given an index in the values() vector, get an
  // Expression** that we can assign to so as to modify it.
  Expression** getIndexPointer(Expression* expr, Index index) {
    if (auto* unary = expr->dynCast<Unary>()) {
      assert(index == 0);
      return &unary->value;
    } else if (auto* binary = expr->dynCast<Binary>()) {
      if (index == 0) {
        return &binary->left;
      } else if (index == 1) {
        return &binary->right;
      } else {
std::cout << "p1\n";
        WASM_UNREACHABLE();
      }
    } else if (auto* select = expr->dynCast<Select>()) {
      if (index == 0) {
        return &select->condition;
      } else if (index == 1) {
        return &select->ifTrue;
      } else if (index == 2) {
        return &select->ifFalse;
      } else {
std::cout << "p2\n";
        WASM_UNREACHABLE();
      }
    } else {
std::cout << "p3\n";
      WASM_UNREACHABLE();
    }
  }
};

Pass *createDataFlowOptsPass() {
  return new DataFlowOpts();
}

} // namespace wasm

