
import { expect } from 'chai';
import Cpu from '../src/cpu';
import * as sinon from 'sinon';

describe('Cpu', () => {
    let cpu : Cpu;

    beforeEach(function () {
        cpu = new Cpu();
    });

    describe('initial values', () => {
        it('currentOpcode should be 0', () => {
            expect(cpu.currentOpcode).equal(0);
        });

        it('memory should be empty', () => {
            expect(cpu.memory.length).equal(0);
        });

        it('registers should be empty', () => {
            expect(cpu.registers.length).equal(0);
        });

        it('index register should be 0', () => {
            expect(cpu.indexRegister).equal(0);
        });

        it('programCounter register should be 0', () => {
            expect(cpu.programCounter).equal(0);
        });

        it('delayTimer should be 0', () => {
            expect(cpu.delayTimer).equal(0);
        });

        it('soundTimer should be 0', () => {
            expect(cpu.soundTimer).equal(0);
        });

        it('stack should be empty', () => {
            expect(cpu.stack.length).equal(0);
        });

        it('stack pointer should be 0', () => {
            expect(cpu.stackPointer).equal(0);
        });

        it('currentKeyPressed should be 0', () => {
            expect(cpu.currentKeyPressed).equal(0);
        });

        it('isHalted should be false', () => {
            expect(cpu.isHalted).equal(false);
        });

        it('hasPendingWaitForStoreKeypressToVX should be false', () => {
            expect(cpu.hasPendingWaitForStoreKeypressToVX).equal(false);
        });

        it('pendingWaitForStoreKeypressToVXRegister should be 0', () => {
            expect(cpu.pendingWaitForStoreKeypressToVXRegister).equal(0);
        });
    });

    describe('keypress', () => {
        it('should update currentKeyPressed', () => {
            cpu.keypress(2);


            expect(cpu.currentKeyPressed).equal(2);
        });

        it('should not call finishWaitForStoreKeypressToVX if hasPendingWaitForStoreKeypressToVX is not set', () => {
            const spy = sinon.spy(cpu, 'finishWaitForStoreKeypressToVX');


            cpu.keypress(2);


            expect(spy.notCalled).equal(true);
        });

        it('should call finishWaitForStoreKeypressToVX if hasPendingWaitForStoreKeypressToVX is set', () => {
            const spy = sinon.spy(cpu, 'finishWaitForStoreKeypressToVX');
            cpu.hasPendingWaitForStoreKeypressToVX = true;
            cpu.pendingWaitForStoreKeypressToVXRegister = 1;


            cpu.keypress(2);


            expect(spy.calledWithExactly(cpu.pendingWaitForStoreKeypressToVXRegister)).equal(true);
        });
    });

    describe('delay timer handling', () => {

        it('returns a decremented value if greater than 0', () => {
            const delayTimer = 10;
            const expectedDelayTimer = 9;


            expect(cpu.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });

        it('returns the same input value if less than 0', () => {
            const delayTimer = 0;
            const expectedDelayTimer = 0;


            expect(cpu.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });
    });

    describe('sound timer handling', () => {

        it('returns a decremented value if greater than 0', () => {
            const soundTimer = 10;
            const expectedSoundTimer = 9;


            expect(cpu.getUpdatedSoundTimer(soundTimer)).equal(expectedSoundTimer);
        });

        it('returns the same input value if less than 0', () => {
            const soundTimer = 0;
            const expectedSoundTimer = 0;


            expect(cpu.getUpdatedDelayTimer(soundTimer)).equal(expectedSoundTimer);
        });
    });

    describe('opcodes', () => {

        context('parsing', () => {
            it('decodes firstMask from opcode', () => {
                const opcode = 0xE000;


                const opcodeFirstMask = cpu.parseOpcodeFirstMask(opcode);


                expect(opcodeFirstMask).equal(0xE000);
            });

            it('decodes X register from opcode', () => {
                const opcode = 0x0F00;


                const decodedXRegister = cpu.parseOpcodeVX(opcode);


                expect(decodedXRegister).equal(15);
            });

            it('decodes Y register from opcode', () => {
                const opcode = 0x00F0;


                const decodedXRegister = cpu.parseOpcodeVY(opcode);


                expect(decodedXRegister).equal(15);
            });

            it('decodes N from opcode', () => {
                const opcode = 0x000F;


                const decodedXRegister = cpu.parseOpcodeN(opcode);


                expect(decodedXRegister).equal(15);
            });

            it('decodes NN from opcode', () => {
                const opcode = 0x00FF;


                const decodedXRegister = cpu.parseOpcodeNN(opcode);


                expect(decodedXRegister).equal(255);
            });

            it('decodes NNN from opcode', () => {
                const opcode = 0x0FFF;


                const decodedXRegister = cpu.parseOpcodeNNN(opcode);


                expect(decodedXRegister).equal(4095);
            });
        });

        context('fetching', () => {
            it('fetches opcode 0xANNN (0xA2F0)', () => {

                const memory = [
                    0xA0,
                    0xA1,
                    0xA2,
                    0xF0,
                ];

                const programCounter = 2;


                expect(cpu.fetchOpcode(memory, programCounter)).equal(0xA2F0);
            });
        });

        context('decoding', () => {

            it('decodes opcode 0x00EE (returnFromSubroutine)', () => {
                cpu.stack.push(1);
                cpu.stack.push(2);
                cpu.stack.push(3);
                cpu.stack.push(4);
                cpu.stackPointer = 2;


                cpu.decodeOpcode(0x00EE);


                expect(cpu.programCounter).equal(3);
                expect(cpu.stackPointer).equal(1);
            });

            it('decodes opcode 0x1NNN (jumpToAddress)', () => {
                cpu.decodeOpcode(0x100A);


                expect(cpu.programCounter).equal(0x00A);
            });

            it('decodes opcode 0x2NNN (jumpToSubroutine)', () => {
                cpu.programCounter = 4;


                cpu.decodeOpcode(0x20F0);


                expect(cpu.stack[cpu.stackPointer - 1]).equal(4);
                expect(cpu.programCounter).equal(0x0F0);
                expect(cpu.stackPointer).equal(1);
            });

            describe('decodes opcode 0x8XY4 (addWithCarry)', () => {
                it('for value less than 256', () => {
                    cpu.registers[0x2] = 6;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).equal(12);
                    expect(cpu.programCounter).equal(2);
                    expect(cpu.registers[0xF]).equal(0);
                });

                it('for value greater than 256', () => {
                    cpu.registers[0x2] = 256;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).equal(262);
                    expect(cpu.programCounter).equal(2);
                    expect(cpu.registers[0xF]).equal(1);
                });
            });

            it('decodes opcode 0xANNN (loadIndexRegister)', () => {
                cpu.programCounter = 4;


                cpu.decodeOpcode(0xA2F0);


                expect(cpu.indexRegister).equal(0x2F0);
                expect(cpu.programCounter).equal(6);
            });

            it('decodes opcode 0xBNNN (jumpWithV0Offset)', () => {
                cpu.programCounter = 6;
                cpu.registers[0] = 0x2;


                cpu.decodeOpcode(0xB002);


                expect(cpu.programCounter).equal(4);
            });

            it('decodes opcode 0xCXNN (storeRandomNumberToVX)', () => {
                const getRandomIntStub = sinon.stub(cpu, 'getRandomIntMax255');
                getRandomIntStub.returns(0xAA);

                cpu.programCounter = 4;


                cpu.decodeOpcode(0xC0A4);


                expect(cpu.registers[0]).equal(0xA0);
                expect(cpu.programCounter).equal(6);
            });

            // it('decodes opcode 0xDXYN (drawVxVy)', () => {
                
            // });

            context('decodes opcode 0xEX9E (skipIfPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).equal(2);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).equal(0);
                });
            });

            context('decodes opcode 0xEXA1 (skipIfNotPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).equal(0);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).equal(2);
                });
            });

            it('decodes opcode 0xFX07 (storeDelayTimerToVX)', () => {
                cpu.delayTimer = 0x2;


                cpu.decodeOpcode(0xF007);


                expect(cpu.registers[0]).equal(0x2);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX0A (waitForStoreKeypressToVX)', () => {
                cpu.decodeOpcode(0xF00A);


                expect(cpu.isHalted).equal(true);
                expect(cpu.hasPendingWaitForStoreKeypressToVX).equal(true);
                expect(cpu.pendingWaitForStoreKeypressToVXRegister).equal(0);
                

                cpu.keypress(2);
                

                expect(cpu.registers[0]).equal(2);
                expect(cpu.currentKeyPressed).equal(2);
                expect(cpu.hasPendingWaitForStoreKeypressToVX).equal(false);
                expect(cpu.isHalted).equal(false);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX15 (storeVXToDelayTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF015);


                expect(cpu.delayTimer).equal(2);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX18 (storeVXToSoundTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF018);


                expect(cpu.soundTimer).equal(2);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX1E (addVXToI)', () => {
                cpu.registers[0] = 2;
                cpu.indexRegister = 1;


                cpu.decodeOpcode(0xF01E);


                expect(cpu.indexRegister).equal(3);
                expect(cpu.programCounter).equal(2);
            });

            // it('decodes opcode 0xFX29 (setIToVXSpriteLocation)', () => {
                
            // });

            it('decodes opcode 0xFX33 (storeDecimalValueToVX)', () => {
                cpu.indexRegister = 0x003;
                cpu.registers[0x3] = 256;


                cpu.decodeOpcode(0xF333);


                expect(cpu.memory[cpu.indexRegister]).equal(2);
                expect(cpu.memory[cpu.indexRegister + 1]).equal(5);
                expect(cpu.memory[cpu.indexRegister + 2]).equal(6);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX55 (storeFromV0VXToMemory)', () => {
                cpu.memory[0] = 0;
                cpu.indexRegister = 1;
                cpu.registers[0] = 2;
                cpu.registers[1] = 2;
                cpu.registers[2] = 2;
                cpu.registers[3] = 2;
                cpu.registers[4] = 2;
                cpu.registers[5] = 2;
                cpu.registers[6] = 2;
                cpu.registers[7] = 2;
                cpu.registers[8] = 2;
                cpu.registers[9] = 2;
                cpu.registers[10] = 2;
                cpu.registers[11] = 2;
                cpu.registers[12] = 2;
                cpu.registers[13] = 2;
                cpu.registers[14] = 2;
                cpu.registers[15] = 2;


                cpu.decodeOpcode(0xFF55);


                const expectedMemory = [];
                expectedMemory[0] = 0;
                expectedMemory[1] = 2;
                expectedMemory[2] = 2;
                expectedMemory[3] = 2;
                expectedMemory[4] = 2;
                expectedMemory[5] = 2;
                expectedMemory[6] = 2;
                expectedMemory[7] = 2;
                expectedMemory[8] = 2;
                expectedMemory[9] = 2;
                expectedMemory[10] = 2;
                expectedMemory[11] = 2;
                expectedMemory[12] = 2;
                expectedMemory[13] = 2;
                expectedMemory[14] = 2;
                expectedMemory[15] = 2;
                expectedMemory[16] = 2;

                expect(cpu.memory).deep.equal(expectedMemory);
                expect(cpu.indexRegister).equal(1);
                expect(cpu.programCounter).equal(2);
            });

            it('decodes opcode 0xFX65 (storeFromMemoryToV0VX)', () => {
                cpu.indexRegister = 1;

                cpu.memory[0] = 0;
                cpu.memory[1] = 2;
                cpu.memory[2] = 2;
                cpu.memory[3] = 2;
                cpu.memory[4] = 2;
                cpu.memory[5] = 2;
                cpu.memory[6] = 2;
                cpu.memory[7] = 2;
                cpu.memory[8] = 2;
                cpu.memory[9] = 2;
                cpu.memory[10] = 2;
                cpu.memory[11] = 2;
                cpu.memory[12] = 2;
                cpu.memory[13] = 2;
                cpu.memory[14] = 2;
                cpu.memory[15] = 2;
                cpu.memory[16] = 2;
                cpu.memory[17] = 2;


                cpu.decodeOpcode(0xFF65);


                expect(cpu.registers[0]).equal(2);
                expect(cpu.registers[1]).equal(2);
                expect(cpu.registers[2]).equal(2);
                expect(cpu.registers[3]).equal(2);
                expect(cpu.registers[4]).equal(2);
                expect(cpu.registers[5]).equal(2);
                expect(cpu.registers[6]).equal(2);
                expect(cpu.registers[7]).equal(2);
                expect(cpu.registers[8]).equal(2);
                expect(cpu.registers[9]).equal(2);
                expect(cpu.registers[10]).equal(2);
                expect(cpu.registers[11]).equal(2);
                expect(cpu.registers[12]).equal(2);
                expect(cpu.registers[13]).equal(2);
                expect(cpu.registers[14]).equal(2);
                expect(cpu.registers[15]).equal(2);
                expect(cpu.registers.length).equal(16);
                expect(cpu.indexRegister).equal(1);
                expect(cpu.programCounter).equal(2)
            });
        });

    });
});
