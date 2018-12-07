package com.walterscarborough.chocolatechip8.interpreter

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class OpcodeParserTest {

    @Nested
    inner class Parsing {

        @Test
        fun `decodes firstMask from opcode'`() {
            val opcode = 0xE000

            val opcodeFirstMask = OpcodeParser.parseOpcodeFirstMask(opcode)

            assertThat(opcodeFirstMask).isEqualTo(0xE000)
        }

        @Test
        fun `decodes X register from opcode'`() {
            val opcode = 0x0F00

            val decodedXRegister = OpcodeParser.parseOpcodeVX(opcode)

            assertThat(decodedXRegister).isEqualTo(0xF)
        }

        @Test
        fun `decodes Y register from opcode'`() {
            val opcode = 0x00F0

            val decodedXRegister = OpcodeParser.parseOpcodeVY(opcode)

            assertThat(decodedXRegister).isEqualTo(0xF)
        }

        @Test
        fun `decodes N from opcode'`() {
            val opcode = 0x000F

            val decodedXRegister = OpcodeParser.parseOpcodeN(opcode)

            assertThat(decodedXRegister).isEqualTo(0xF)
        }

        @Test
        fun `decodes NN from opcode'`() {
            val opcode = 0x00FF

            val decodedXRegister = OpcodeParser.parseOpcodeNN(opcode)

            assertThat(decodedXRegister).isEqualTo(0xFF)
        }

        @Test
        fun `decodes NNN from opcode'`() {
            val opcode = 0x0FFF

            val decodedXRegister = OpcodeParser.parseOpcodeNNN(opcode)

            assertThat(decodedXRegister).isEqualTo(0xFFF)
        }
    }
}