package com.walterscarborough.chocolatechip8

class Cpu {
    val memory: IntArray = IntArray(4096)
    val registers: IntArray = IntArray(16)
    val indexRegister: Int = 0
    var programCounter: Int = 0x200
    val delayTimer: Int = 0
    val soundTimer: Int = 0
    var stack: IntArray = IntArray(16)
    var stackPointer: Int = 0

    fun fetchOpcode(memory: IntArray, programCounter: Int): Int {

        val opcodeFragmentA: Int = memory[programCounter]
        val opcodeFragmentB: Int = memory[programCounter + 1]

        val leftShiftedOpcodeFragmentA = opcodeFragmentA shl 8

        val completeOpcode = leftShiftedOpcodeFragmentA or opcodeFragmentB;

        return completeOpcode;
    }

    fun executeOpcode(opcode: Opcode_RETURN_FROM_SUBROUTINE) {
        this.programCounter = this.stack[this.stackPointer]
        this.stackPointer -= 1
    }

    fun executeOpcode(opcode: Opcode_JUMP_TO_ADDRESS) {
        val nnnAddress = OpcodeParser.parseOpcodeNNN(opcode.value)
        this.programCounter = nnnAddress
    }
}