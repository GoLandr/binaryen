function asmFunc(global, env, buffer) {
 "use asm";
 var HEAP8 = new global.Int8Array(buffer);
 var HEAP16 = new global.Int16Array(buffer);
 var HEAP32 = new global.Int32Array(buffer);
 var HEAPU8 = new global.Uint8Array(buffer);
 var HEAPU16 = new global.Uint16Array(buffer);
 var HEAPU32 = new global.Uint32Array(buffer);
 var HEAPF32 = new global.Float32Array(buffer);
 var HEAPF64 = new global.Float64Array(buffer);
 var Math_imul = global.Math.imul;
 var Math_fround = global.Math.fround;
 var Math_abs = global.Math.abs;
 var Math_clz32 = global.Math.clz32;
 var Math_min = global.Math.min;
 var Math_max = global.Math.max;
 var Math_floor = global.Math.floor;
 var Math_ceil = global.Math.ceil;
 var Math_sqrt = global.Math.sqrt;
 var i64toi32_i32$HIGH_BITS = 0;
 function dummy() {
  
 }
 
 function $1($0) {
  $0 = $0 | 0;
  return ((HEAPF32[0] = (HEAP32[0] = $0, HEAPF32[0]), HEAP32[0]) | 0) == ($0 | 0) | 0;
 }
 
 function $2($0, $0$hi) {
  $0 = $0 | 0;
  $0$hi = $0$hi | 0;
  var i64toi32_i32$0 = 0, $3$hi = 0;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$0 = i64toi32_i32$0;
  HEAP32[0 >> 2] = $0;
  HEAP32[(0 + 4 | 0) >> 2] = i64toi32_i32$0;
  HEAPF64[0 >> 3] = +HEAPF64[0 >> 3];
  i64toi32_i32$0 = HEAP32[(0 + 4 | 0) >> 2] | 0;
  $3$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $0$hi;
  i64toi32_i32$0 = $3$hi;
  return (HEAP32[0 >> 2] | 0 | 0) == ($0 | 0) & (i64toi32_i32$0 | 0) == ($0$hi | 0) | 0 | 0;
 }
 
 return {
  i32_roundtrip: $1, 
  i64_roundtrip: $2
 };
}

