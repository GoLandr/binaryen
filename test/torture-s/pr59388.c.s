	.text
	.file	"pr59388.c"
	.section	.text.main,"ax",@progbits
	.hidden	main                    # -- Begin function main
	.globl	main
	.type	main,@function
main:                                   # @main
	.result 	i32
	.local  	i32
# %bb.0:                                # %entry
	i32.const	$push0=, 0
	i32.load8_u	$push1=, b($pop0)
	i32.const	$push2=, 1
	i32.and 	$0=, $pop1, $pop2
	i32.const	$push3=, 0
	i32.store	a($pop3), $0
	copy_local	$push4=, $0
                                        # fallthrough-return: $pop4
	.endfunc
.Lfunc_end0:
	.size	main, .Lfunc_end0-main
                                        # -- End function
	.hidden	b                       # @b
	.type	b,@object
	.section	.bss.b,"aw",@nobits
	.globl	b
	.p2align	2
b:
	.skip	4
	.size	b, 4

	.hidden	a                       # @a
	.type	a,@object
	.section	.bss.a,"aw",@nobits
	.globl	a
	.p2align	2
a:
	.int32	0                       # 0x0
	.size	a, 4


	.ident	"clang version 7.0.0 (https://llvm.googlesource.com/clang.git 1f874ca3c3f27c2149b6b33ca4a5966b3577280d) (https://llvm.googlesource.com/llvm.git 2e4bd2aa729dd2c33cdca2b39c971c675e914001)"
