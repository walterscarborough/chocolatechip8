package com.walterscarborough.chocolatechip8

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
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
                    assertThat(cpu.memory[i]).isEqualTo(0)
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
                    assertThat(cpu.registers[i]).isEqualTo(0)
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
                    assertThat(cpu.stack[i]).isEqualTo(0)
                }
            }
        }
    }

    @Nested
    inner class FetchOpcode {

        @Test
        fun `should fetch 2 byte opcode from memory in current program counter location`() {

            val modifiedMemory = IntArray(4096)
            modifiedMemory[0] = 0xA0
            modifiedMemory[1] = 0xA1
            modifiedMemory[2] = 0xA2
            modifiedMemory[3] = 0xF0

            val modifiedProgramCounter = 0x2

            cpu = Cpu(
                    memory = modifiedMemory,
                    programCounter = modifiedProgramCounter
            )

            assertThat(cpu.fetchOpcode()).isEqualTo(0xA2F0)
            assertCpuState(
                    memory = modifiedMemory,
                    programCounter = modifiedProgramCounter
            )
        }
    }

    @Nested
    inner class ExecuteOpcode {

        @Test
        fun `should execute opcode 0x00EE (returnFromSubroutine)`() {
            val modifiedStack = IntArray(16, { it + 1 })

            cpu = Cpu(
                    stack = modifiedStack,
                    stackPointer = 0x2
            )

            cpu.executeOpcode(Opcode_RETURN_FROM_SUBROUTINE(0x00EE))

            assertCpuState(
                    programCounter = 0x3,
                    stack = modifiedStack,
                    stackPointer = 0x1
            )
        }

        @Test
        fun `should execute opcode 0x1NNN (jumpToAddress)`() {
            cpu.executeOpcode(Opcode_JUMP_TO_ADDRESS(0x100A))

            assertCpuState(
                    programCounter = 0x00A
            )
        }

        @Test
        fun `should execute opcode 0x2NNN (jumpToSubroutine)`() {
            val modifiedStack = IntArray(16, { it + 1 })

            cpu = Cpu(
                    stack = modifiedStack,
                    programCounter = 0x4,
                    stackPointer = 0x1
            )

            cpu.executeOpcode(Opcode_JUMP_TO_SUBROUTINE(0x20F0))

            val expectedStack = intArrayOf(1, 4, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
            assertCpuState(
                    programCounter = 0x0F0,
                    stackPointer = 0x2,
                    stack = expectedStack
            )
        }
    }

    private fun assertCpuState(
            memory: IntArray = IntArray(4096),
            registers: IntArray = IntArray(16),
            indexRegister: Int = 0,
            programCounter: Int = 0x200,
            delayTimer: Int = 0,
            soundTimer: Int = 0,
            stack: IntArray = IntArray(16),
            stackPointer: Int = 0
    ) {
        assertThat(cpu.memory).isEqualTo(memory)
        assertThat(cpu.registers).isEqualTo(registers)
        assertThat(cpu.indexRegister).isEqualTo(indexRegister)
        assertThat(cpu.programCounter).isEqualTo(programCounter)
        assertThat(cpu.delayTimer).isEqualTo(delayTimer)
        assertThat(cpu.soundTimer).isEqualTo(soundTimer)
        assertThat(cpu.stack).isEqualTo(stack)
        assertThat(cpu.stackPointer).isEqualTo(stackPointer)
    }
}