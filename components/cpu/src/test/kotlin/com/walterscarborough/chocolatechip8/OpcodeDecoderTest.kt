package com.walterscarborough.chocolatechip8

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test

class OpcodeDecoderTest {

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
        val expected = Opcode_RETURN_FROM_SUBROUTINE()
        val actual = OpcodeDecoder.decode(0x00EE)

        assertThat(actual::class).isEqualTo(expected::class)
    }
}