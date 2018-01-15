package com.walterscarborough.chocolatechip8

import kotlin.math.floor

class Cpu {

    constructor(
            memory: IntArray = IntArray(4096),
            registers: IntArray = IntArray(16),
            indexRegister: Int = 0,
            programCounter: Int = 0x200,
            delayTimer: Int = 0,
            soundTimer: Int = 0,
            stack: IntArray = IntArray(16),
            stackPointer: Int = 0,
            randomNumberGenerator: RandomNumberGenerator = Max255RandomNumberGenerator(),
            display: Display = OutputDisplay()
    ) {
        this.memory = memory
        this.registers = registers
        this.indexRegister = indexRegister
        this.programCounter = programCounter
        this.delayTimer = delayTimer
        this.soundTimer = soundTimer
        this.stack = stack
        this.stackPointer = stackPointer
        this.randomNumberGenerator = randomNumberGenerator
        this.display = display
    }

    var memory: IntArray
        private set
    var registers: IntArray
        private set
    var indexRegister: Int
        private set
    var programCounter: Int
        private set
    var delayTimer: Int
        private set
    var soundTimer: Int
        private set
    var stack: IntArray
        private set
    var stackPointer: Int
        private set
    val randomNumberGenerator: RandomNumberGenerator
    val display: Display

    fun fetchOpcode(): Int {

        val opcodeFragmentA: Int = memory[programCounter]
        val opcodeFragmentB: Int = memory[programCounter + 1]

        val leftShiftedOpcodeFragmentA = opcodeFragmentA shl 8

        val completeOpcode = leftShiftedOpcodeFragmentA or opcodeFragmentB

        return completeOpcode
    }

    fun executeOpcode(@Suppress("UNUSED_PARAMETER") opcode: Opcode_RETURN_FROM_SUBROUTINE) {
        programCounter = stack[stackPointer]
        stackPointer -= 1
    }

    fun executeOpcode(opcode: Opcode_JUMP_TO_ADDRESS) {
        val nnnAddress = OpcodeParser.parseOpcodeNNN(opcode.value)
        programCounter = nnnAddress
    }

    fun executeOpcode(opcode: Opcode_JUMP_TO_SUBROUTINE) {
        stack[stackPointer] = programCounter
        stackPointer += 1
        programCounter = OpcodeParser.parseOpcodeNNN(opcode.value)
    }

    fun executeOpcode(opcode: Opcode_SKIP_IF_VX_EQUALS_NN) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val nnAddress = OpcodeParser.parseOpcodeNN(opcode.value)

        if (nnAddress == registers[vX]) {
            programCounter += 4
        } else {
            programCounter += 2
        }
    }

    fun executeOpcode(opcode: Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val nnAddress = OpcodeParser.parseOpcodeNN(opcode.value)

        if (nnAddress != registers[vX]) {
            programCounter += 4
        }
        else {
            programCounter += 2
        }
    }

    fun executeOpcode(opcode: Opcode_SKIP_IF_VX_EQUALS_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        if (registers[vX] == registers[vY]) {
            programCounter += 4
        } else {
            programCounter += 2
        }
    }

    fun executeOpcode(opcode: Opcode_SET_VX_TO_NN) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val nnAddress = OpcodeParser.parseOpcodeNN(opcode.value)

        registers[vX] = nnAddress
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_ADD_NN_TO_VX) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val nn = OpcodeParser.parseOpcodeNN(opcode.value)

        registers[vX] += nn
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SET_VX_TO_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        registers[vX] = registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SET_VX_TO_BITWISE_OR_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        registers[vX] = registers[vX] or registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SET_VX_TO_BITWISE_AND_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        registers[vX] = registers[vX] and registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SET_VX_TO_BITWISE_X_OR_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        registers[vX] = registers[vX] xor registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_ADD_WITH_CARRY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        if (registers[vY] > (0xFF - registers[vX])) {
            registers[0xF] = 1
        }
        else {
            registers[0xF] = 0
        }

        registers[vX] += registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        if (registers[vX] < registers[vY]) {
            registers[0xF] = 1
        }
        else {
            registers[0xF] = 0
        }

        registers[vX] = registers[vX] - registers[vY]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SHIFT_VX_RIGHT) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        registers[0xF] = registers[vX] and 0x1

        registers[vX] = registers[vX] shr 1
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)

        if (registers[vX] < registers[vY]) {
            registers[0xF] = 0
        }
        else {
            registers[0xF] = 1
        }

        registers[vX] = registers[vY] - registers[vX]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_LOAD_INDEX_REGISTER) {
        val nnnAddress = OpcodeParser.parseOpcodeNNN(opcode.value)
        indexRegister = nnnAddress
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_JUMP_WITH_V0_OFFSET) {
        val nnnAddress = OpcodeParser.parseOpcodeNNN(opcode.value)
        val v0Data = registers[0]

        programCounter = nnnAddress + v0Data
    }

    fun executeOpcode(opcode: Opcode_STORE_RANDOM_NUMBER_TO_VX) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val sourceNumber = OpcodeParser.parseOpcodeNN(opcode.value)
        val randomNumber = randomNumberGenerator.getRandomInt()

        val adjustedNumber = sourceNumber and randomNumber

        registers[vX] = adjustedNumber
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_DRAW_VX_VY) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)
        val vY = OpcodeParser.parseOpcodeVY(opcode.value)
        val height = OpcodeParser.parseOpcodeN(opcode.value)

        var yLine = 0
        while (yLine < height) {
            val pixel = memory[indexRegister + yLine]

            var xLine = 0
            while (xLine < 8) {
                if ((pixel and (0x80 shr xLine)) != 0) {
                    if (display.graphicsData[(vX + xLine + ((vY + yLine) * 64))] == 1) {
                        registers[0xF] = 1
                    }

                    display.graphicsData[vX + xLine + ((vY + yLine) * 64)] = display.graphicsData[vX + xLine + ((vY + yLine) * 64)] xor 1
                }

                xLine++
            }

            yLine++
        }

        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_STORE_DELAY_TIMER_TO_VX) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        registers[vX] = delayTimer
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_STORE_VX_TO_DELAY_TIMER) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        delayTimer = registers[vX]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_STORE_VX_TO_SOUND_TIMER) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        soundTimer = registers[vX]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_ADD_VX_TO_I) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        indexRegister += registers[vX]
        programCounter += 2
    }

    fun executeOpcode(opcode: Opcode_STORE_DECIMAL_VALUE_TO_VX) {
        val vX = OpcodeParser.parseOpcodeVX(opcode.value)

        memory[indexRegister] = floor((registers[vX] / 100).toDouble()).toInt()
        memory[indexRegister + 1] = floor(((registers[vX] / 10) % 10).toDouble()).toInt()
        memory[indexRegister + 2] = floor(((registers[vX] % 100) % 10).toDouble()).toInt()

        programCounter += 2
    }
}