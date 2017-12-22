package com.walterscarborough.chocolatechip8

class OpcodeDecoder {

    companion object {

        fun decode(opcode: Int): Opcode {

            val opcodeFirstMask = OpcodeParser.parseOpcodeFirstMask(opcode)
            val opcodeN = OpcodeParser.parseOpcodeN(opcode)
            val opcodeNN = OpcodeParser.parseOpcodeNN(opcode)

            when (opcodeFirstMask) {
                0x0000 -> when (opcodeNN) {
                    0x00EE -> return Opcode_RETURN_FROM_SUBROUTINE()
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0x1000 -> return Opcode_JUMP_TO_ADDRESS()
                0x2000 -> return Opcode_JUMP_TO_SUBROUTINE()
                0x3000 -> return Opcode_SKIP_IF_VX_EQUALS_NN()
                0x4000 -> return Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN()
                0x5000 -> return Opcode_SKIP_IF_VX_EQUALS_VY()
                0x6000 -> return Opcode_SET_VX_TO_NN()
                0x7000 -> return Opcode_ADD_NN_TO_VX()

                0x8000 -> when (opcodeN) {
                    0x0000 -> return Opcode_SET_VX_TO_VY()
                    0x0001 -> return Opcode_SET_VX_TO_BITWISE_OR_VY()
                    0x0002 -> return Opcode_SET_VX_TO_BITWISE_AND_VY()
                    0x0003 -> return Opcode_SET_VX_TO_BITWISE_X_OR_VY()
                    0x0004 -> return Opcode_ADD_WITH_CARRY()
                    0x0005 -> return Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY()
                    0x0006 -> return Opcode_SHIFT_VX_RIGHT()
                    0x0007 -> return Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY()
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0xA000 -> return Opcode_LOAD_INDEX_REGISTER()
                0xB000 -> return Opcode_JUMP_WITH_V0_OFFSET()
                0xC000 -> return Opcode_STORE_RANDOM_NUMBER_TO_VX()
                0xD000 -> return Opcode_DRAW_VX_VY()

                0xE000 -> when (opcodeNN) {
                    0x009E -> return Opcode_SKIP_IF_PRESSED()
                    0x00A1 -> return Opcode_SKIP_IF_NOT_PRESSED()
                    else -> throw Exception(getErrorMessage(opcode))
                }

                0xF000 -> when (opcodeNN) {
                    0x0007 -> return Opcode_STORE_DELAY_TIMER_TO_VX()
                    0x000A -> return Opcode_START_WAIT_FOR_STORE_KEYPRESS_TO_VX()
                    0x0015 -> return Opcode_STORE_VX_TO_DELAY_TIMER()
                    0x0018 -> return Opcode_STORE_VX_TO_SOUND_TIMER()
                    0x001E -> return Opcode_ADD_VX_TO_I()
                    0x0033 -> return Opcode_STORE_DECIMAL_VALUE_TO_VX()
                    0x0055 -> return Opcode_STORE_FROM_V0_VX_TO_MEMORY()
                    0x0065 -> return Opcode_STORE_FROM_MEMORY_TO_V0_VX()
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