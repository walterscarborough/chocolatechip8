package com.walterscarborough.chocolatechip8

object OpcodeParser {
    fun parseOpcodeFirstMask(opcode: Int): Int {
        val opcodeFirstMask = opcode and 0xF000

        return opcodeFirstMask
    }

    fun parseOpcodeVX(opcode: Int): Int {
        val vX = (opcode and 0x0F00) shr 8

        return vX
    }

    fun parseOpcodeVY(opcode: Int): Int {
        val vY = (opcode and 0x00F0) shr 4

        return vY
    }

    fun parseOpcodeN(opcode: Int): Int {
        val n = opcode and 0x000F

        return n
    }

    fun parseOpcodeNN(opcode: Int): Int {
        val nn = opcode and 0x00FF

        return nn
    }

    fun parseOpcodeNNN(opcode: Int): Int {
        val nn = opcode and 0x0FFF

        return nn
    }
}