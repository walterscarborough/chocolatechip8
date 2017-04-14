
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

    describe('timer handling', () => {
        it('can get an updated delay timer', () => {
            const delayTimer = 10;
            const expectedDelayTimer = 9;


            expect(cpu.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });

        it('can get an updated sound timer', () => {
            const soundTimer = 10;
            const expectedSoundTimer = 9;


            expect(cpu.getUpdatedSoundTimer(soundTimer)).equal(expectedSoundTimer);
        });
    });

    describe('opcode handling', () => {

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
            });

            it('decodes opcode 0xFX15 (storeVXToDelayTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF015);


                expect(cpu.delayTimer).equal(2);
            });

            it('decodes opcode 0xFX33 (storeDecimalValueToVX)', () => {
                cpu.indexRegister = 0x003;
                cpu.registers[0x3] = 256;


                cpu.decodeOpcode(0xF333);


                expect(cpu.memory[cpu.indexRegister]).equal(2);
                expect(cpu.memory[cpu.indexRegister + 1]).equal(5);
                expect(cpu.memory[cpu.indexRegister + 2]).equal(6);
                expect(cpu.programCounter).equal(2);
            });
        });

    });
});
