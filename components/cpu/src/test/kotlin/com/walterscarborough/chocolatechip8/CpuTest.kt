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
            val modifiedStack = getSequentialIntArray()

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
            val modifiedStack = getSequentialIntArray()

            cpu = Cpu(
                    stack = modifiedStack,
                    programCounter = 0x4,
                    stackPointer = 0x1
            )

            cpu.executeOpcode(Opcode_JUMP_TO_SUBROUTINE(0x20F0))

            val expectedStack = getSequentialIntArray()
            expectedStack[1] = 4
            assertCpuState(
                    programCounter = 0x0F0,
                    stackPointer = 0x2,
                    stack = expectedStack
            )
        }

        @Nested
        inner class `should execute opcode 0x3XNN (skipIfVXEqualsNN)` {

            @Test
            fun `when VX equals NN`() {

                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 3

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_EQUALS_NN(0x3003))

                assertCpuState(
                        programCounter = 0x204,
                        registers = modifiedRegisters
                )
            }

            @Test
            fun `when VX does not equal NN`() {

                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 2

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_EQUALS_NN(0x3003))

                assertCpuState(
                        programCounter = 0x202,
                        registers = modifiedRegisters
                )
            }
        }

        @Nested
        inner class `should execute opcode 0x4XNN (skipIfVXDoesNotEqualNN)` {

            @Test
            fun `when VX equals NN`() {
                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 3

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN(0x4003))

                assertCpuState(
                        programCounter = 0x202,
                        registers = modifiedRegisters
                )
            }

            @Test
            fun `when VX does not equal NN`() {
                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 2

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN(0x4003))

                assertCpuState(
                        programCounter = 0x204,
                        registers = modifiedRegisters
                )
            }
        }

        @Nested
        inner class `should execute opcode 0x5XY0 (skipIfVXEqualsVY)` {

            @Test
            fun `when VX equals VY`() {
                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 3
                modifiedRegisters[1] = 3

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_EQUALS_VY(0x5010))

                assertCpuState(
                        programCounter = 0x204,
                        registers = modifiedRegisters
                )
            }

            @Test
            fun `when VX does not equal VY`() {
                val modifiedRegisters = getSequentialIntArray()
                modifiedRegisters[0] = 2
                modifiedRegisters[1] = 3

                cpu = Cpu(registers = modifiedRegisters)

                cpu.executeOpcode(Opcode_SKIP_IF_VX_EQUALS_VY(0x5010))

                assertCpuState(
                        programCounter = 0x202,
                        registers = modifiedRegisters
                )
            }
        }

        @Test
        fun `should execute opcode 0x6XNN (setVXToNN)`() {
            val modifiedRegisters = getSequentialIntArray()
            modifiedRegisters[0] = 3

            cpu = Cpu(registers = modifiedRegisters)

            cpu.executeOpcode(Opcode_SET_VX_TO_NN(0x6006))

            val expectedRegisters = getSequentialIntArray()
            expectedRegisters[0] = 6
            assertCpuState(
                    programCounter = 0x202,
                    registers = expectedRegisters
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

    private fun getSequentialIntArray(): IntArray {
        return IntArray(16, { it + 1 })
    }
}