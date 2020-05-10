import Cpu from '../cpu';
import RandomNumberGenerator from '../randomNumberGenerator';
import OpcodeDecoder from "../opcodeDecoder";
import {Opcodes} from "../opcodes";
import {StubDisplay} from "./display/StubDisplay";

describe('Cpu', () => {
    let cpu: Cpu;
    let stubDisplay: StubDisplay;
    beforeEach(() => {
        stubDisplay = new StubDisplay();
        cpu = new Cpu(stubDisplay);
        jest.restoreAllMocks();
    });

    describe('initial values', () => {
        it('currentOpcode should be 0', () => {
            expect(cpu.currentOpcode).toEqual(0);
        });

        it('memory should be empty', () => {
            for (let i = 0; i < 4096; i++) {
                expect(cpu.memory[i]).toEqual(0);
            }

            expect(cpu.memory.length).toEqual(4096);
        });

        it('all 16 registers should be set to 0', () => {
            for (let i = 0; i < 16; i++) {
                expect(cpu.registers[i]).toEqual(0);
            }

            expect(cpu.registers.length).toEqual(16);
        });

        it('index register should be 0', () => {
            expect(cpu.indexRegister).toEqual(0);
        });

        it('programCounter register should be 0', () => {
            expect(cpu.programCounter).toEqual(0x200);
        });

        it('delayTimer should be 0', () => {
            expect(cpu.delayTimer).toEqual(0);
        });

        it('soundTimer should be 0', () => {
            expect(cpu.soundTimer).toEqual(0);
        });

        it('stack should be empty', () => {
            expect(cpu.stack.length).toEqual(0);
        });

        it('stack pointer should be 0', () => {
            expect(cpu.stackPointer).toEqual(0);
        });

        it('currentKeyPressed should be 0', () => {
            expect(cpu.currentKeyPressed).toEqual(0);
        });

        it('isHalted should be false', () => {
            expect(cpu.isHalted).toEqual(false);
        });

        it('hasPendingWaitForStoreKeypressToVX should be false', () => {
            expect(cpu.hasPendingWaitForStoreKeypressToVX).toEqual(false);
        });

        it('pendingWaitForStoreKeypressToVXRegister should be 0', () => {
            expect(cpu.pendingWaitForStoreKeypressToVXRegister).toEqual(0);
        });
    });

    describe('keypress', () => {
        it('should update currentKeyPressed', () => {
            cpu.keypress(2);


            expect(cpu.currentKeyPressed).toEqual(2);
        });

        it('should not call finishWaitForStoreKeypressToVX if hasPendingWaitForStoreKeypressToVX is not set', () => {
            const spy = jest.spyOn(cpu, 'finishWaitForStoreKeypressToVX');


            cpu.keypress(2);


            expect(spy).not.toHaveBeenCalled()
        });

        it('should call finishWaitForStoreKeypressToVX if hasPendingWaitForStoreKeypressToVX is set', () => {
            const spy = jest.spyOn(cpu, 'finishWaitForStoreKeypressToVX');
            cpu.hasPendingWaitForStoreKeypressToVX = true;
            cpu.pendingWaitForStoreKeypressToVXRegister = 1;


            cpu.keypress(2);


            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(cpu.pendingWaitForStoreKeypressToVXRegister);
        });
    });

    describe('opcodes', () => {

        describe('fetching', () => {
            it('fetches opcode 0xANNN (0xA2F0)', () => {

                const memory = [
                    0xA0,
                    0xA1,
                    0xA2,
                    0xF0,
                ];

                const programCounter = 0x2;


                expect(cpu.fetchOpcode(memory, programCounter)).toEqual(0xA2F0);
            });
        });

        describe('decoding', () => {

            it('fails when decoding an unknown opcode', () => {
                jest
                    .spyOn(OpcodeDecoder, 'decodeOpcode')
                    .mockImplementation(() => Opcodes.EXECUTE_SUBROUTINE_NNN);

                expect(() => cpu.decodeOpcode(0x0000)).toThrowError('Error: cpu found unknown opcode');
            });

            it.skip('decodes opcode 0NNN (executeSubroutineNNN)', () => {

            });

            it('decodes opcode 00E0 (clearDisplay)', () => {
                cpu.decodeOpcode(0x00E0);

                expect(stubDisplay.clearDisplayCallCount).toEqual(1);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 00EE (returnFromSubroutine)', () => {
                cpu.stack.push(1);
                cpu.stack.push(2);
                cpu.stack.push(3);
                cpu.stack.push(4);
                cpu.stackPointer = 2;


                cpu.decodeOpcode(0x00EE);


                expect(cpu.programCounter).toEqual(0x3);
                expect(cpu.stackPointer).toEqual(1);
            });

            it('decodes opcode 1NNN (jumpToAddress)', () => {
                cpu.decodeOpcode(0x100A);


                expect(cpu.programCounter).toEqual(0x00A);
            });

            it('decodes opcode 2NNN (jumpToSubroutine)', () => {
                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0x20F0);


                expect(cpu.stack[cpu.stackPointer - 1]).toEqual(4);
                expect(cpu.programCounter).toEqual(0x0F0);
                expect(cpu.stackPointer).toEqual(1);
            });

            describe('decodes opcode 3XNN (skipIfVXEqualsNN)', () => {
                it('when VX equals NN', () => {
                    cpu.registers[0] = 3;


                    cpu.decodeOpcode(0x3003);


                    expect(cpu.programCounter).toEqual(0x204);
                });

                it('when VX does not equal NN', () => {
                    cpu.registers[0] = 2;


                    cpu.decodeOpcode(0x3003);


                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            describe('decodes opcode 4XNN (skipIfVXDoesNotEqualNN)', () => {
                it('when VX equals NN', () => {
                    cpu.registers[0] = 3;


                    cpu.decodeOpcode(0x4003);


                    expect(cpu.programCounter).toEqual(0x202);
                });

                it('when VX does not equal NN', () => {
                    cpu.registers[0] = 2;


                    cpu.decodeOpcode(0x4003);


                    expect(cpu.programCounter).toEqual(0x204);
                });
            });

            describe('decodes opcode 5XY0 (skipIfVXEqualsVY)', () => {
                it('when VX equals VY', () => {
                    cpu.registers[0] = 3;
                    cpu.registers[1] = 3;


                    cpu.decodeOpcode(0x5010);


                    expect(cpu.programCounter).toEqual(0x204);
                });

                it('when VX does not equal VY', () => {
                    cpu.registers[0] = 2;
                    cpu.registers[1] = 3;


                    cpu.decodeOpcode(0x5010);


                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            it('decodes opcode 6XNN (setVXToNN)', () => {
                cpu.registers[0] = 3;


                cpu.decodeOpcode(0x6006);


                expect(cpu.registers[0]).toEqual(6);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 7XNN (addNNToVX)', () => {
                cpu.registers[0] = 3;


                cpu.decodeOpcode(0x7006);


                expect(cpu.registers[0]).toEqual(9);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 8XY0 (setVXToVY)', () => {
                cpu.registers[0] = 3;
                cpu.registers[1] = 7;


                cpu.decodeOpcode(0x8010);


                expect(cpu.registers[0]).toEqual(7);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 8XY1 (setVXToBitwiseOrVY)', () => {
                cpu.registers[0] = 0x3;
                cpu.registers[1] = 0x7;


                cpu.decodeOpcode(0x8011);


                expect(cpu.registers[0]).toEqual(0x7);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 8XY2 (setVXToBitwiseAndVY)', () => {
                cpu.registers[0] = 0x4;
                cpu.registers[1] = 0x4;


                cpu.decodeOpcode(0x8012);


                expect(cpu.registers[0]).toEqual(0x4);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode 8XY3 (setVXToBitwiseXorVY)', () => {
                cpu.registers[0] = 0x3;
                cpu.registers[1] = 0x7;


                cpu.decodeOpcode(0x8013);


                expect(cpu.registers[0]).toEqual(0x4);
                expect(cpu.programCounter).toEqual(0x202);
            });

            describe('decodes opcode 8XY4 (addWithCarry)', () => {
                it('for value less than 256', () => {
                    cpu.registers[0x2] = 6;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).toEqual(12);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(0);
                });

                it('for value greater than 256', () => {
                    cpu.registers[0x2] = 256;
                    cpu.registers[0x3] = 6;


                    cpu.decodeOpcode(0x8234);


                    expect(cpu.registers[0x2]).toEqual(262);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(1);
                });
            });

            describe('decodes opcode 8XY5 (subtractVYFromVXWithCarry)', () => {
                it('when VX is less than VY', () => {
                    cpu.registers[0x0] = 1;
                    cpu.registers[0x1] = 6;


                    cpu.decodeOpcode(0x8015);


                    expect(cpu.registers[0x0]).toEqual(-5);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(1);
                });

                it('when VX is greater than VY', () => {
                    cpu.registers[0x0] = 6;
                    cpu.registers[0x1] = 1;


                    cpu.decodeOpcode(0x8015);


                    expect(cpu.registers[0x0]).toEqual(5);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(0);
                });
            });

            describe(`decodes opcode 8XY6 ${Opcodes.SHIFT_RIGHT_VX_VY}`, () => {
                it('when least significant bit is 1', () => {
                    cpu.registers[0xF] = 0x004;
                    cpu.registers[0xA] = 0x003;
                    cpu.registers[0xB] = 0x201;

                    cpu.decodeOpcode(0x8AB6);

                    expect(cpu.registers[0xA]).toEqual(0x100);
                    expect(cpu.registers[0xB]).toEqual(0x201);
                    expect(cpu.registers[0xF]).toEqual(0x001);
                    expect(cpu.programCounter).toEqual(0x202);
                });

                it('when least significant bit is not 1', () => {
                    cpu.registers[0xF] = 0x004;
                    cpu.registers[0xA] = 0x003;
                    cpu.registers[0xB] = 0x200;

                    cpu.decodeOpcode(0x8AB6);

                    expect(cpu.registers[0xA]).toEqual(0x100);
                    expect(cpu.registers[0xB]).toEqual(0x200);
                    expect(cpu.registers[0xF]).toEqual(0x000);
                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            describe('decodes opcode 8XY7 (subtractVXFromVYWithCarry)', () => {

                it('when VX is greater than VY', () => {
                    cpu.registers[0x0] = 0x7;
                    cpu.registers[0x1] = 0x2;


                    cpu.decodeOpcode(0x8017);


                    expect(cpu.registers[0x0]).toEqual(-5);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(1);
                });

                it('when VX is less than VY', () => {
                    cpu.registers[0x0] = 0x2;
                    cpu.registers[0x1] = 0x7;


                    cpu.decodeOpcode(0x8017);


                    expect(cpu.registers[0x0]).toEqual(5);
                    expect(cpu.programCounter).toEqual(0x202);
                    expect(cpu.registers[0xF]).toEqual(0);
                });
            });

            describe('decodes opcode 8XYE (shiftLeftVxVy)', () => {

                it('when most significant bit of Vx is 1', () => {
                    cpu.registers[0xF] = 0x004;
                    cpu.registers[0xA] = 0x003;
                    cpu.registers[0xB] = 0x100;

                    cpu.decodeOpcode(0x8ABE);

                    expect(cpu.registers[0xA]).toEqual(0x200);
                    expect(cpu.registers[0xB]).toEqual(0x100);
                    expect(cpu.registers[0xF]).toEqual(0x001);
                    expect(cpu.programCounter).toEqual(0x202);
                });

                it('when most significant bit of Vx is not 1', () => {
                    cpu.registers[0xF] = 0x004;
                    cpu.registers[0xA] = 0x003;
                    cpu.registers[0xB] = 0x001;

                    cpu.decodeOpcode(0x8ABE);

                    expect(cpu.registers[0xA]).toEqual(0x002);
                    expect(cpu.registers[0xB]).toEqual(0x001);
                    expect(cpu.registers[0xF]).toEqual(0x000);
                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            describe('decodes opcode 9XY0 (skipIfVXNotEqualVY)', () => {
                it('should skip when vX and vY are not equal', () => {
                    cpu.registers[0xA] = 0x010;
                    cpu.registers[0xB] = 0x001;

                    cpu.decodeOpcode(0x9AB0);
                    expect(cpu.programCounter).toEqual(0x204);
                });

                it('should not skip when vX and vY are equal', () => {
                    cpu.registers[0xA] = 0x010;
                    cpu.registers[0xB] = 0x010;

                    cpu.decodeOpcode(0x9AB0);
                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            it('decodes opcode ANNN (loadIndexRegister)', () => {
                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0xA2F0);


                expect(cpu.indexRegister).toEqual(0x2F0);
                expect(cpu.programCounter).toEqual(0x6);
            });

            it('decodes opcode BNNN (jumpWithV0Offset)', () => {
                cpu.programCounter = 6;
                cpu.registers[0] = 0x2;


                cpu.decodeOpcode(0xB002);


                expect(cpu.programCounter).toEqual(4);
            });

            it('decodes opcode CXNN (storeRandomNumberToVX)', () => {
                const getRandomIntStub = jest
                    .spyOn(RandomNumberGenerator, 'getRandomIntMax255')
                    .mockImplementation(() => 0xAA);

                cpu.programCounter = 0x4;


                cpu.decodeOpcode(0xC0A4);


                expect(cpu.registers[0]).toEqual(0xA0);
                expect(cpu.programCounter).toEqual(0x6);
            });

            describe('decodes opcode DXYN (drawVxVy)', () => {

                it('when vF does not need to be set', () => {

                    cpu.indexRegister = 0x201;
                    cpu.memory[0x201] = 0x3C;
                    cpu.memory[0x202] = 0xC3;
                    cpu.memory[0x203] = 0xFF;
                    cpu.programCounter = 0x204;

                    cpu.decodeOpcode(0xD003);


                    expect(JSON.stringify(cpu.graphicsOutput)).toEqual(
                        JSON.stringify(
                            [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        )
                    );

                    expect(cpu.registers[0xF]).toEqual(0);
                    expect(cpu.programCounter).toEqual(0x206);
                });

                it('when vF does need to be set', () => {

                    cpu.indexRegister = 0x201;
                    cpu.memory[0x201] = 0x3C;
                    cpu.memory[0x202] = 0xC3;
                    cpu.memory[0x203] = 0xFF;
                    cpu.programCounter = 0x204;
                    cpu.graphicsOutput = [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

                    cpu.decodeOpcode(0xD003);


                    expect(JSON.stringify(cpu.graphicsOutput)).toEqual(
                        JSON.stringify(
                            [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        )
                    );

                    expect(cpu.registers[0xF]).toEqual(1);
                    expect(cpu.programCounter).toEqual(0x206);
                });
            });

            describe('decodes opcode EX9E (skipIfPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).toEqual(0x202);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE09E);


                    expect(cpu.programCounter).toEqual(0x200);
                });
            });

            describe('decodes opcode EXA1 (skipIfNotPressed)', () => {

                it('key in V0 is pressed', () => {
                    cpu.currentKeyPressed = 1;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).toEqual(0x200);
                });

                it('key in V0 is not pressed', () => {
                    cpu.currentKeyPressed = 2;
                    cpu.registers[0] = 1;


                    cpu.decodeOpcode(0xE0A1);


                    expect(cpu.programCounter).toEqual(0x202);
                });
            });

            it('decodes opcode FX07 (storeDelayTimerToVX)', () => {
                cpu.delayTimer = 0x2;


                cpu.decodeOpcode(0xF007);


                expect(cpu.registers[0]).toEqual(0x2);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX0A (waitForStoreKeypressToVX)', () => {
                cpu.decodeOpcode(0xF00A);


                expect(cpu.isHalted).toEqual(true);
                expect(cpu.hasPendingWaitForStoreKeypressToVX).toEqual(true);
                expect(cpu.pendingWaitForStoreKeypressToVXRegister).toEqual(0);


                cpu.keypress(2);


                expect(cpu.registers[0]).toEqual(2);
                expect(cpu.currentKeyPressed).toEqual(2);
                expect(cpu.hasPendingWaitForStoreKeypressToVX).toEqual(false);
                expect(cpu.isHalted).toEqual(false);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX15 (storeVXToDelayTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF015);


                expect(cpu.delayTimer).toEqual(2);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX18 (storeVXToSoundTimer)', () => {
                cpu.registers[0] = 2;


                cpu.decodeOpcode(0xF018);


                expect(cpu.soundTimer).toEqual(2);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX1E (addVXToI)', () => {
                cpu.registers[0] = 2;
                cpu.indexRegister = 1;


                cpu.decodeOpcode(0xF01E);


                expect(cpu.indexRegister).toEqual(3);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX29 (setIToVXSpriteLocation)', () => {
                cpu.registers[0xA] = 0x010;

                cpu.decodeOpcode(0xFA29);

                expect(cpu.indexRegister).toEqual(0x050)
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX33 (storeDecimalValueToVX)', () => {
                cpu.indexRegister = 0x003;
                cpu.registers[0x3] = 256;


                cpu.decodeOpcode(0xF333);


                expect(cpu.memory[cpu.indexRegister]).toEqual(2);
                expect(cpu.memory[cpu.indexRegister + 1]).toEqual(5);
                expect(cpu.memory[cpu.indexRegister + 2]).toEqual(6);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX55 (storeFromV0VXToMemory)', () => {
                cpu.memory = [];
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

                expect(cpu.memory).toEqual(expectedMemory);
                expect(cpu.indexRegister).toEqual(1);
                expect(cpu.programCounter).toEqual(0x202);
            });

            it('decodes opcode FX65 (storeFromMemoryToV0VX)', () => {
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


                expect(cpu.registers[0]).toEqual(2);
                expect(cpu.registers[1]).toEqual(2);
                expect(cpu.registers[2]).toEqual(2);
                expect(cpu.registers[3]).toEqual(2);
                expect(cpu.registers[4]).toEqual(2);
                expect(cpu.registers[5]).toEqual(2);
                expect(cpu.registers[6]).toEqual(2);
                expect(cpu.registers[7]).toEqual(2);
                expect(cpu.registers[8]).toEqual(2);
                expect(cpu.registers[9]).toEqual(2);
                expect(cpu.registers[10]).toEqual(2);
                expect(cpu.registers[11]).toEqual(2);
                expect(cpu.registers[12]).toEqual(2);
                expect(cpu.registers[13]).toEqual(2);
                expect(cpu.registers[14]).toEqual(2);
                expect(cpu.registers[15]).toEqual(2);
                expect(cpu.registers.length).toEqual(16);
                expect(cpu.indexRegister).toEqual(1);
                expect(cpu.programCounter).toEqual(0x202)
            });
        });

    });
});
