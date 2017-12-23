package com.walterscarborough.chocolatechip8

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class OpcodeDecoderTest {

    @Nested
    inner class Decode {

        @Disabled
        @Test
        fun `should decode opcode 0x0NNN (executeSubroutineNNN)`() {

        }

        @Disabled
        @Test
        fun `should decode opcode 0x00E0 (clearDisplay)`() {

        }

        @Test
        fun `should decode opcode 0x00EE (returnFromSubroutine)`() {
            val expected = Opcode_RETURN_FROM_SUBROUTINE(0x00EE)
            val actual = OpcodeDecoder.decode(0x00EE)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x1NNN (jumpToAddress)`() {
            val expected = Opcode_JUMP_TO_ADDRESS(0x100A)
            val actual = OpcodeDecoder.decode(0x100A)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x2NNN (jumpToSubroutine)`() {
            val expected = Opcode_JUMP_TO_SUBROUTINE(0x20F0)
            val actual = OpcodeDecoder.decode(0x20F0)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x3XNN (skipIfVXEqualsNN)`() {
            val expected = Opcode_SKIP_IF_VX_EQUALS_NN(0x3003)
            val actual = OpcodeDecoder.decode(0x3003)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x4XNN (skipIfVXDoesNotEqualNN)`() {
            val expected = Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN(0x4003)
            val actual = OpcodeDecoder.decode(0x4003)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x5XY0 (skipIfVXEqualsVY)`() {
            val expected = Opcode_SKIP_IF_VX_EQUALS_VY(0x5010)
            val actual = OpcodeDecoder.decode(0x5010)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x6XNN (setVXToNN)`() {
            val expected = Opcode_SET_VX_TO_NN(0x6006)
            val actual = OpcodeDecoder.decode(0x6006)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x7XNN (addNNToVX)`() {
            val expected = Opcode_ADD_NN_TO_VX(0x7006)
            val actual = OpcodeDecoder.decode(0x7006)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY0 (setVXToVY)`() {
            val expected = Opcode_SET_VX_TO_VY(0x8010)
            val actual = OpcodeDecoder.decode(0x8010)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY1 (setVXToBitwiseOrVY)`() {
            val expected = Opcode_SET_VX_TO_BITWISE_OR_VY(0x8011)
            val actual = OpcodeDecoder.decode(0x8011)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY2 (setVXToBitwiseAndVY)`() {
            val expected = Opcode_SET_VX_TO_BITWISE_AND_VY(0x8012)
            val actual = OpcodeDecoder.decode(0x8012)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY3 (setVXToBitwiseXorVY)`() {
            val expected = Opcode_SET_VX_TO_BITWISE_X_OR_VY(0x8013)
            val actual = OpcodeDecoder.decode(0x8013)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY4 (addWithCarry)`() {
            val expected = Opcode_ADD_WITH_CARRY(0x8234)
            val actual = OpcodeDecoder.decode(0x8234)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY5 (subtractVYFromVXWithCarry)`() {
            val expected = Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY(0x8015)
            val actual = OpcodeDecoder.decode(0x8015)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY6 (shiftVXRight)`() {
            val expected = Opcode_SHIFT_VX_RIGHT(0x8006)
            val actual = OpcodeDecoder.decode(0x8006)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0x8XY7 (subtractVXFromVYWithCarry)`() {
            val expected = Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY(0x8017)
            val actual = OpcodeDecoder.decode(0x8017)

            assertThat(actual).isEqualTo(expected)
        }

        @Disabled
        @Test
        fun `should decode opcode 0x8XYE (shiftLeftVYStoreVX)`() {

        }

        @Disabled
        @Test
        fun `should decode opcode 0x9XY0 (skipIfVXNotEqualVY)`() {

        }

        @Test
        fun `should decode opcode 0xANNN (loadIndexRegister)`() {
            val expected = Opcode_LOAD_INDEX_REGISTER(0xA2F0)
            val actual = OpcodeDecoder.decode(0xA2F0)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xBNNN (jumpWithV0Offset)`() {
            val expected = Opcode_JUMP_WITH_V0_OFFSET(0xB002)
            val actual = OpcodeDecoder.decode(0xB002)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xCXNN (storeRandomNumberToVX)`() {
            val expected = Opcode_STORE_RANDOM_NUMBER_TO_VX(0xC0A4)
            val actual = OpcodeDecoder.decode(0xC0A4)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xDXYN (drawVxVy)`() {
            val expected = Opcode_DRAW_VX_VY(0xD003)
            val actual = OpcodeDecoder.decode(0xD003)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xEX9E (skipIfPressed)`() {
            val expected = Opcode_SKIP_IF_PRESSED(0xE09E)
            val actual = OpcodeDecoder.decode(0xE09E)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xEXA1 (skipIfNotPressed)`() {
            val expected = Opcode_SKIP_IF_NOT_PRESSED(0xE0A1)
            val actual = OpcodeDecoder.decode(0xE0A1)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX07 (storeDelayTimerToVX)`() {
            val expected = Opcode_STORE_DELAY_TIMER_TO_VX(0xF007)
            val actual = OpcodeDecoder.decode(0xF007)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX0A (waitForStoreKeypressToVX)`() {
            val expected = Opcode_START_WAIT_FOR_STORE_KEYPRESS_TO_VX(0xF00A)
            val actual = OpcodeDecoder.decode(0xF00A)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX15 (storeVXToDelayTimer)`() {
            val expected = Opcode_STORE_VX_TO_DELAY_TIMER(0xF015)
            val actual = OpcodeDecoder.decode(0xF015)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX18 (storeVXToSoundTimer)`() {
            val expected = Opcode_STORE_VX_TO_SOUND_TIMER(0xF018)
            val actual = OpcodeDecoder.decode(0xF018)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX1E (addVXToI)`() {
            val expected = Opcode_ADD_VX_TO_I(0xF01E)
            val actual = OpcodeDecoder.decode(0xF01E)

            assertThat(actual).isEqualTo(expected)
        }

        @Disabled
        @Test
        fun `should decode opcode 0xFX29 (setIToVXSpriteLocation)`() {

        }

        @Test
        fun `should decode opcode 0xFX33 (storeDecimalValueToVX)`() {
            val expected = Opcode_STORE_DECIMAL_VALUE_TO_VX(0xF333)
            val actual = OpcodeDecoder.decode(0xF333)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX55 (storeFromV0VXToMemory)`() {
            val expected = Opcode_STORE_FROM_V0_VX_TO_MEMORY(0xFF55)
            val actual = OpcodeDecoder.decode(0xFF55)

            assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun `should decode opcode 0xFX65 (storeFromMemoryToV0VX)`() {
            val expected = Opcode_STORE_FROM_MEMORY_TO_V0_VX(0xFF65)
            val actual = OpcodeDecoder.decode(0xFF65)

            assertThat(actual).isEqualTo(expected)
        }
    }

    @Nested
    inner class Unsupported {

        @Test
        fun `should throw an exception for unsupported opcode 0x00EF`() {
            assertThrows(Exception::class.java) {
                OpcodeDecoder.decode(0x00EF)
            }
        }

        @Test
        fun `should throw an exception for unsupported opcode 0x0008`() {
            assertThrows(Exception::class.java) {
                OpcodeDecoder.decode(0x0008)
            }
        }

        @Test
        fun `should throw an exception for unsupported opcode 0x00A2`() {
            assertThrows(Exception::class.java) {
                OpcodeDecoder.decode(0x00A2)
            }
        }

        @Test
        fun `should throw an exception for unsupported opcode 0x0066`() {
            assertThrows(Exception::class.java) {
                OpcodeDecoder.decode(0x0066)
            }
        }

        @Test
        fun `should throw an exception for unsupported opcode 0x9000`() {
            assertThrows(Exception::class.java) {
                OpcodeDecoder.decode(0x9000)
            }
        }
    }
}