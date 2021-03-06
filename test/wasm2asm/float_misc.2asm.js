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
 function $0(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(x + y));
 }
 
 function $1(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(x - y));
 }
 
 function $2(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(x * y));
 }
 
 function $3(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(x / y));
 }
 
 function $4(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(Math_sqrt(x)));
 }
 
 function $5(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(Math_abs(x)));
 }
 
 function $6(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(-x));
 }
 
 function $7(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround((HEAP32[0] = (HEAPF32[0] = x, HEAP32[0]) & 2147483647 | 0 | ((HEAPF32[0] = y, HEAP32[0]) & 2147483648 | 0) | 0, HEAPF32[0]));
 }
 
 function $8(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(Math_ceil(x)));
 }
 
 function $9(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(Math_floor(x)));
 }
 
 function $10(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(__wasm_trunc_f32(Math_fround(x))));
 }
 
 function $11(x) {
  x = Math_fround(x);
  return Math_fround(Math_fround(__wasm_nearest_f32(Math_fround(x))));
 }
 
 function $12(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(Math_min(x, y)));
 }
 
 function $13(x, y) {
  x = Math_fround(x);
  y = Math_fround(y);
  return Math_fround(Math_fround(Math_max(x, y)));
 }
 
 function $14(x, y) {
  x = +x;
  y = +y;
  return +(x + y);
 }
 
 function $15(x, y) {
  x = +x;
  y = +y;
  return +(x - y);
 }
 
 function $16(x, y) {
  x = +x;
  y = +y;
  return +(x * y);
 }
 
 function $17(x, y) {
  x = +x;
  y = +y;
  return +(x / y);
 }
 
 function $18(x) {
  x = +x;
  return +Math_sqrt(x);
 }
 
 function $19(x) {
  x = +x;
  return +Math_abs(x);
 }
 
 function $20(x) {
  x = +x;
  return +-x;
 }
 
 function $21(x, y) {
  x = +x;
  y = +y;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, $4 = 0, $4$hi = 0, $7 = 0, $7$hi = 0;
  HEAPF64[0 >> 3] = x;
  i64toi32_i32$0 = HEAP32[(0 + 4 | 0) >> 2] | 0;
  i64toi32_i32$0 = i64toi32_i32$0;
  i64toi32_i32$2 = HEAP32[0 >> 2] | 0;
  i64toi32_i32$1 = 2147483647;
  i64toi32_i32$3 = 4294967295;
  i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
  $4 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
  $4$hi = i64toi32_i32$1;
  HEAPF64[0 >> 3] = y;
  i64toi32_i32$1 = HEAP32[(0 + 4 | 0) >> 2] | 0;
  i64toi32_i32$1 = i64toi32_i32$1;
  i64toi32_i32$0 = HEAP32[0 >> 2] | 0;
  i64toi32_i32$2 = 2147483648;
  i64toi32_i32$3 = 0;
  i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
  $7 = i64toi32_i32$0 & i64toi32_i32$3 | 0;
  $7$hi = i64toi32_i32$2;
  i64toi32_i32$2 = $4$hi;
  i64toi32_i32$1 = $4;
  i64toi32_i32$0 = $7$hi;
  i64toi32_i32$3 = $7;
  i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
  i64toi32_i32$0 = i64toi32_i32$0;
  HEAP32[0 >> 2] = i64toi32_i32$1 | i64toi32_i32$3 | 0;
  HEAP32[(0 + 4 | 0) >> 2] = i64toi32_i32$0;
  return +(+HEAPF64[0 >> 3]);
 }
 
 function $22(x) {
  x = +x;
  return +Math_ceil(x);
 }
 
 function $23(x) {
  x = +x;
  return +Math_floor(x);
 }
 
 function $24(x) {
  x = +x;
  return +(+__wasm_trunc_f64(+x));
 }
 
 function $25(x) {
  x = +x;
  return +(+__wasm_nearest_f64(+x));
 }
 
 function $26(x, y) {
  x = +x;
  y = +y;
  return +Math_min(x, y);
 }
 
 function $27(x, y) {
  x = +x;
  y = +y;
  return +Math_max(x, y);
 }
 
 function __wasm_nearest_f32($0) {
  $0 = Math_fround($0);
  var $2 = Math_fround(0), $1 = Math_fround(0), $3 = Math_fround(0), $34 = Math_fround(0), $32 = Math_fround(0), $4 = Math_fround(0), $28 = Math_fround(0);
  $1 = Math_fround(Math_ceil($0));
  $2 = Math_fround(Math_floor($0));
  $3 = Math_fround($0 - $2);
  if ($3 < Math_fround(.5)) $34 = $2; else {
   if ($3 > Math_fround(.5)) $32 = $1; else {
    $4 = Math_fround($2 / Math_fround(2.0));
    if (Math_fround($4 - Math_fround(Math_floor($4))) == Math_fround(0.0)) $28 = $2; else $28 = $1;
    $32 = $28;
   }
   $34 = $32;
  }
  return Math_fround($34);
 }
 
 function __wasm_nearest_f64($0) {
  $0 = +$0;
  var $2 = 0.0, $1 = 0.0, $3 = 0.0, $34 = 0.0, $32 = 0.0, $4 = 0.0, $28 = 0.0;
  $1 = Math_ceil($0);
  $2 = Math_floor($0);
  $3 = $0 - $2;
  if ($3 < .5) $34 = $2; else {
   if ($3 > .5) $32 = $1; else {
    $4 = $2 / 2.0;
    if ($4 - Math_floor($4) == 0.0) $28 = $2; else $28 = $1;
    $32 = $28;
   }
   $34 = $32;
  }
  return +$34;
 }
 
 function __wasm_trunc_f32($0) {
  $0 = Math_fround($0);
  var $7 = Math_fround(0);
  if ($0 < Math_fround(0.0)) $7 = Math_fround(Math_ceil($0)); else $7 = Math_fround(Math_floor($0));
  return Math_fround($7);
 }
 
 function __wasm_trunc_f64($0) {
  $0 = +$0;
  var $7 = 0.0;
  if ($0 < 0.0) $7 = Math_ceil($0); else $7 = Math_floor($0);
  return +$7;
 }
 
 return {
  f32_add: $0, 
  f32_sub: $1, 
  f32_mul: $2, 
  f32_div: $3, 
  f32_sqrt: $4, 
  f32_abs: $5, 
  f32_neg: $6, 
  f32_copysign: $7, 
  f32_ceil: $8, 
  f32_floor: $9, 
  f32_trunc: $10, 
  f32_nearest: $11, 
  f32_min: $12, 
  f32_max: $13, 
  f64_add: $14, 
  f64_sub: $15, 
  f64_mul: $16, 
  f64_div: $17, 
  f64_sqrt: $18, 
  f64_abs: $19, 
  f64_neg: $20, 
  f64_copysign: $21, 
  f64_ceil: $22, 
  f64_floor: $23, 
  f64_trunc: $24, 
  f64_nearest: $25, 
  f64_min: $26, 
  f64_max: $27
 };
}

