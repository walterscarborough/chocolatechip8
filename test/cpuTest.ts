
import { expect } from 'chai';
import Cpu from '../src/cpu';
import RandomNumberGenerator from '../src/randomNumberGenerator';
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
            expect(cpu.programCounter).equal(0x200);
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

    describe('opcodes', () => {

        context('fetching', () => {
            it('fetches opcode 0xANNN (0xA2F0)', () => {

                const memory = [
                    0xA0,
                    0xA1,
                    0xA2,
                    0xF0,
                ];

                const programCounter = 0x2;


                expect(cpu.fetchOpcode(memory, programCounter)).equal(0xA2F0);
            });
        });

        context('decoding', () => {

            it.skip('decodes opcode 0x0NNN (executeSubroutineNNN)', () => {

            });

            it.skip('decodes opcode 0x00E0 (clearDisplay)', () => {

            });

            it('decodes opcode 0x00EE (returnFromSubroutine)', () => {
                cpu.stack.push(1);
                cpu.stack.push(2);
                cpu.stack.push(3);
                cpu.stack.push(4);
                cpu.stackPointer = 2;


                cpu.decodeOpcode(0x00EE);


                expect(cpu.programCounter).equal(0x3);
                expect(cpu.stackPointer).equal(1);
            });

            it('decodes opcode 0x1NNN (jumpToAddress)', () => {
                cpu.decodeOpcode(0x100A);


                expect(cpu.programCounter).equal(0x00A);
            });

            it('decodes opcode 0x2NNN (jumpToSubroutine)', () => {
                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0x20F0);


                expect(cpu.stack[cpu.stackPointer - 1]).equal(4);
                expect(cpu.programCounter).equal(0x0F0);
                expect(cpu.stackPointer).equal(1);
            });

            context('decodes opcode 0x3XNN (skipIfVXEqualsNN)', () => {
                it('when VX equals NN', () => {
                    cpu.registers[0] = 3;


                    cpu.decodeOpcode(0x3003);


                    expect(cpu.programCounter).equal(0x204);
                });

                it('when VX does not equal NN', () => {
                    cpu.registers[0] = 2;


                    cpu.decodeOpcode(0x3003);


                    expect(cpu.programCounter).equal(0x202);
                });
            });

            context('decodes opcode 0x4XNN (skipIfVXDoesNotEqualNN)', () => {
                it('when VX equals NN', () => {
                    cpu.registers[0] = 3;


                    cpu.decodeOpcode(0x4003);


                    expect(cpu.programCounter).equal(0x202);
                });

                it('when VX does not equal NN', () => {
                    cpu.registers[0] = 2;


                    cpu.decodeOpcode(0x4003);


                    expect(cpu.programCounter).equal(0x204);
                });
            });

            context('decodes opcode 0x5XY0 (skipIfVXEqualsVY)', () => {
                it('when VX equals VY', () => {
                    cpu.registers[0] = 3;
                    cpu.registers[1] = 3;


                    cpu.decodeOpcode(0x5010);


                    expect(cpu.programCounter).equal(0x204);
                });

                it('when VX does not equal VY', () => {
                    cpu.registers[0] = 2;
                    cpu.registers[1] = 3;


                    cpu.decodeOpcode(0x5010);


                    expect(cpu.programCounter).equal(0x202);
                });
            });

            it('decodes opcode 0x6XNN (setVXToNN)', () => {
                cpu.registers[0] = 3;


                cpu.decodeOpcode(0x6006);


                expect(cpu.registers[0]).equal(6);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0x7XNN (addNNToVX)', () => {
                cpu.registers[0] = 3;


                cpu.decodeOpcode(0x7006);


                expect(cpu.registers[0]).equal(9);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0x8XY0 (setVXToVY)', () => {
                cpu.registers[0] = 3;
                cpu.registers[1] = 7;


                cpu.decodeOpcode(0x8010);


                expect(cpu.registers[0]).equal(7);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0x8XY1 (setVXToBitwiseOrVY)', () => {
                cpu.registers[0] = 0x3;
                cpu.registers[1] = 0x7;


                cpu.decodeOpcode(0x8011);


                expect(cpu.registers[0]).equal(0x7);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0x8XY2 (setVXToBitwiseAndVY)', () => {
                cpu.registers[0] = 0x4;
                cpu.registers[1] = 0x4;


                cpu.decodeOpcode(0x8012);


                expect(cpu.registers[0]).equal(0x4);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0x8XY3 (setVXToBitwiseXorVY)', () => {
                cpu.registers[0] = 0x3;
                cpu.registers[1] = 0x7;


                cpu.decodeOpcode(0x8013);


                expect(cpu.registers[0]).equal(0x4);
                expect(cpu.programCounter).equal(0x202);
            });

            describe('decodes opcode 0x8XY4 (addWithCarry)', () => {
                it('for value less than 256', () => {
                    cpu.registers[0x2] = 6;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).equal(12);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(0);
                });

                it('for value greater than 256', () => {
                    cpu.registers[0x2] = 256;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).equal(262);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(1);
                });
            });

            describe('decodes opcode 0x8XY5 (subtractVYFromVXWithCarry)', () => {
                it('when VX is less than VY', () => {
                    cpu.registers[0x0] = 1;
                    cpu.registers[0x1] = 6;


                    cpu.decodeOpcode(0x8015);


                    expect(cpu.registers[0x0]).equal(-5);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(1);
                });

                it('when VX is greater than VY', () => {
                    cpu.registers[0x0] = 6;
                    cpu.registers[0x1] = 1;


                    cpu.decodeOpcode(0x8015);


                    expect(cpu.registers[0x0]).equal(5);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(0);
                });
            });

            it('decodes opcode 0x8XY6 (shiftVXRight)', () => {
                cpu.registers[0x0] = 0x25;


                cpu.decodeOpcode(0x8006);


                expect(cpu.registers[0x0]).equal(18);
                expect(cpu.programCounter).equal(0x202);
                expect(cpu.registers[0xF]).equal(1);
            });

            describe('decodes opcode 0x8XY7 (subtractVXFromVYWithCarry)', () => {

                it('when VX is greater than VY', () => {
                    cpu.registers[0x0] = 0x7;
                    cpu.registers[0x1] = 0x2;


                    cpu.decodeOpcode(0x8017);


                    expect(cpu.registers[0x0]).equal(-5);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(1);
                });

                it('when VX is less than VY', () => {
                    cpu.registers[0x0] = 0x2;
                    cpu.registers[0x1] = 0x7;


                    cpu.decodeOpcode(0x8017);


                    expect(cpu.registers[0x0]).equal(5);
                    expect(cpu.programCounter).equal(0x202);
                    expect(cpu.registers[0xF]).equal(0);
                });
            });

            it.skip('decodes opcode 0x8XYE (shiftLeftVYStoreVX)', () => {

            });

            it.skip('decodes opcode 0x9XY0 (skipIfVXNotEqualVY)', () => {

            });

            it('decodes opcode 0xANNN (loadIndexRegister)', () => {
                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0xA2F0);


                expect(cpu.indexRegister).equal(0x2F0);
                expect(cpu.programCounter).equal(0x6);
            });

            it('decodes opcode 0xBNNN (jumpWithV0Offset)', () => {
                cpu.programCounter = 6;
                cpu.registers[0] = 0x2;


                cpu.decodeOpcode(0xB002);


                expect(cpu.programCounter).equal(4);
            });

            it('decodes opcode 0xCXNN (storeRandomNumberToVX)', () => {
                const getRandomIntStub = sinon.stub(RandomNumberGenerator, 'getRandomIntMax255');
                getRandomIntStub.returns(0xAA);

                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0xC0A4);


                expect(cpu.registers[0]).equal(0xA0);
                expect(cpu.programCounter).equal(0x6);
            });

            it.skip('decodes opcode 0xDXYN (drawVxVy)', () => {

            });

            context('decodes opcode 0xEX9E (skipIfPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).equal(0x202);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).equal(0x200);
                });
            });

            context('decodes opcode 0xEXA1 (skipIfNotPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).equal(0x200);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).equal(0x202);
                });
            });

            it('decodes opcode 0xFX07 (storeDelayTimerToVX)', () => {
                cpu.delayTimer = 0x2;


                cpu.decodeOpcode(0xF007);


                expect(cpu.registers[0]).equal(0x2);
                expect(cpu.programCounter).equal(0x202);
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
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0xFX15 (storeVXToDelayTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF015);


                expect(cpu.delayTimer).equal(2);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0xFX18 (storeVXToSoundTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF018);


                expect(cpu.soundTimer).equal(2);
                expect(cpu.programCounter).equal(0x202);
            });

            it('decodes opcode 0xFX1E (addVXToI)', () => {
                cpu.registers[0] = 2;
                cpu.indexRegister = 1;


                cpu.decodeOpcode(0xF01E);


                expect(cpu.indexRegister).equal(3);
                expect(cpu.programCounter).equal(0x202);
            });

            it.skip('decodes opcode 0xFX29 (setIToVXSpriteLocation)', () => {

            });

            it('decodes opcode 0xFX33 (storeDecimalValueToVX)', () => {
                cpu.indexRegister = 0x003;
                cpu.registers[0x3] = 256;


                cpu.decodeOpcode(0xF333);


                expect(cpu.memory[cpu.indexRegister]).equal(2);
                expect(cpu.memory[cpu.indexRegister + 1]).equal(5);
                expect(cpu.memory[cpu.indexRegister + 2]).equal(6);
                expect(cpu.programCounter).equal(0x202);
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
                expect(cpu.programCounter).equal(0x202);
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
                expect(cpu.programCounter).equal(0x202)
            });
        });

    });
});
