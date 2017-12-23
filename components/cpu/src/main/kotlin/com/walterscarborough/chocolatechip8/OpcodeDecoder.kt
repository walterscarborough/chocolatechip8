package com.walterscarborough.chocolatechip8

class OpcodeDecoder {

    companion object {

        fun decode(opcode: Int): Opcode {

            val opcodeFirstMask = OpcodeParser.parseOpcodeFirstMask(opcode)
            val opcodeN = OpcodeParser.parseOpcodeN(opcode)
            val opcodeNN = OpcodeParser.parseOpcodeNN(opcode)

            return when (opcodeFirstMask) {
                0x0000 -> when (opcodeNN) {
                    0x00EE -> Opcode_RETURN_FROM_SUBROUTINE(opcode)
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0x1000 -> Opcode_JUMP_TO_ADDRESS(opcode)
                0x2000 -> Opcode_JUMP_TO_SUBROUTINE(opcode)
                0x3000 -> Opcode_SKIP_IF_VX_EQUALS_NN(opcode)
                0x4000 -> Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN(opcode)
                0x5000 -> Opcode_SKIP_IF_VX_EQUALS_VY(opcode)
                0x6000 -> Opcode_SET_VX_TO_NN(opcode)
                0x7000 -> Opcode_ADD_NN_TO_VX(opcode)

                0x8000 -> when (opcodeN) {
                    0x0000 -> Opcode_SET_VX_TO_VY(opcode)
                    0x0001 -> Opcode_SET_VX_TO_BITWISE_OR_VY(opcode)
                    0x0002 -> Opcode_SET_VX_TO_BITWISE_AND_VY(opcode)
                    0x0003 -> Opcode_SET_VX_TO_BITWISE_X_OR_VY(opcode)
                    0x0004 -> Opcode_ADD_WITH_CARRY(opcode)
                    0x0005 -> Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY(opcode)
                    0x0006 -> Opcode_SHIFT_VX_RIGHT(opcode)
                    0x0007 -> Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY(opcode)
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0xA000 -> Opcode_LOAD_INDEX_REGISTER(opcode)
                0xB000 -> Opcode_JUMP_WITH_V0_OFFSET(opcode)
                0xC000 -> Opcode_STORE_RANDOM_NUMBER_TO_VX(opcode)
                0xD000 -> Opcode_DRAW_VX_VY(opcode)

                0xE000 -> when (opcodeNN) {
                    0x009E -> Opcode_SKIP_IF_PRESSED(opcode)
                    0x00A1 -> Opcode_SKIP_IF_NOT_PRESSED(opcode)
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0xF000 -> when (opcodeNN) {
                    0x0007 -> Opcode_STORE_DELAY_TIMER_TO_VX(opcode)
                    0x000A -> Opcode_START_WAIT_FOR_STORE_KEYPRESS_TO_VX(opcode)
                    0x0015 -> Opcode_STORE_VX_TO_DELAY_TIMER(opcode)
                    0x0018 -> Opcode_STORE_VX_TO_SOUND_TIMER(opcode)
                    0x001E -> Opcode_ADD_VX_TO_I(opcode)
                    0x0033 -> Opcode_STORE_DECIMAL_VALUE_TO_VX(opcode)
                    0x0055 -> Opcode_STORE_FROM_V0_VX_TO_MEMORY(opcode)
                    0x0065 -> Opcode_STORE_FROM_MEMORY_TO_V0_VX(opcode)
                    else -> throw Exception(getErrorMessage(opcode))
                }

                else -> throw Exception(getErrorMessage(opcode))
            }
        }

        private fun getErrorMessage(opcode: Int): String {
            return "opcode $opcode not implemented"
        }
    }
}