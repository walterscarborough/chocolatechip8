package com.walterscarborough.chocolatechip8

class Cpu {
    val memory = IntArray(4096)
    val registers = IntArray(16)
    val indexRegister: Int = 0
    val programCounter: Int = 0x200
    val delayTimer: Int = 0
    val soundTimer: Int = 0
    val stack = IntArray(16)
    var stackPointer: Int = 0

    fun fetchOpcode(memory: IntArray, programCounter: Int): Int {

        val opcodeFragmentA: Int = memory[programCounter]
        val opcodeFragmentB: Int = memory[programCounter + 1]

        val leftShiftedOpcodeFragmentA = opcodeFragmentA shl 8

        val completeOpcode = leftShiftedOpcodeFragmentA or opcodeFragmentB;

        return completeOpcode;
    }

//    fun decodeOpcode(opcode: Int): Opcode {
//
//    }
}