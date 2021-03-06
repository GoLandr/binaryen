(module
 (func $copysign64 (param $0 f64) (param $1 f64) (result f64)
   (f64.copysign (get_local $0) (get_local $1)))
 (func $copysign32 (param $0 f32) (param $1 f32) (result f32)
   (f32.copysign (get_local $0) (get_local $1)))

 (func $rotl32 (param $0 i32) (param $1 i32) (result i32)
   (i32.rotl (get_local $0) (get_local $1)))
 (func $rotr32 (param $0 i32) (param $1 i32) (result i32)
   (i32.rotr (get_local $0) (get_local $1)))

 (func $nearest64 (param $0 f64) (result f64)
   (f64.nearest (get_local $0)))
 (func $nearest32 (param $0 f32) (result f32)
   (f32.nearest (get_local $0)))

 (func $trunc64 (param $0 f64) (result f64)
   (f64.trunc (get_local $0)))
 (func $trunc32 (param $0 f32) (result f32)
   (f32.trunc (get_local $0)))

 (func $popcnt32 (param $0 i32) (result i32)
   (i32.popcnt (get_local $0)))
 (func $ctz32 (param $0 i32) (result i32)
   (i32.ctz (get_local $0)))
)

