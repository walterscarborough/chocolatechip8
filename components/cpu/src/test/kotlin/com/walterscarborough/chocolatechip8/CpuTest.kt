package com.walterscarborough.chocolatechip8

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class CpuTest {

    private lateinit var cpu: Cpu

    @BeforeEach
    fun setUp() {
        cpu = Cpu()
    }

    @Nested
    inner class Initialization {

        @Nested
        inner class Memory {

            @Test
            fun `should have length 4096`() {
                assertThat(cpu.memory.size).isEqualTo(4096)
            }

            @Test
            fun `should be initialized to 0`() {
                for (i in 0..4095) {
                    assertThat(cpu.memory.get(i)).isEqualTo(0)
                }
            }
        }

        @Nested
        inner class GeneralRegisters {

            @Test
            fun `should have length 16`() {
                assertThat(cpu.registers.size).isEqualTo(16)
            }

            @Test
            fun `should be initialized to 0`() {
                for (i in 0..15) {
                    assertThat(cpu.registers.get(i)).isEqualTo(0)
                }
            }
        }

        @Test
        fun `IndexRegister should be initialized to 0`() {
            assertThat(cpu.indexRegister).isEqualTo(0)
        }

        @Test
        fun `ProgramCounter should be initialized to 0x200`() {
            assertThat(cpu.programCounter).isEqualTo(0x200)
        }

        @Test
        fun `DelayTimer should be initialized to 0`() {
            assertThat(cpu.delayTimer).isEqualTo(0)
        }

        @Test
        fun `SoundTimer should be initialized to 0`() {
            assertThat(cpu.soundTimer).isEqualTo(0)
        }

        @Test
        fun `StackPointer should be initialized to 0`() {
            assertThat(cpu.stackPointer).isEqualTo(0)
        }

        @Nested
        inner class Stack {

            @Test
            fun `should have length 16`() {
                assertThat(cpu.stack.size).isEqualTo(16)
            }

            @Test
            fun `should be initialized to 0`() {
                for (i in 0..15) {
                    assertThat(cpu.stack.get(i)).isEqualTo(0)
                }
            }
        }
    }

    @Nested
    inner class Opcodes {

        @Test
        fun `should fetch 2 byte opcode from memory in current program counter location`() {
            val memory = intArrayOf(
                0xA0,
                0xA1,
                0xA2,
                0xF0
            )

            val programCounter = 0x2

            assertThat(cpu.fetchOpcode(memory, programCounter)).isEqualTo(0xA2F0)
        }
    }

}