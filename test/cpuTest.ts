
import { expect } from 'chai';
import Cpu from '../src/cpu';

describe('Cpu', () => {
    var cpu : Cpu;

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

        it('stack pointer should be empty', () => {
            expect(cpu.stackPointer).equal(0);
        });
    });

    describe('timer handling', () => {
        it('can get an updated delay timer', () => {
            let delayTimer = 10;

            let expectedDelayTimer = 9;


            expect(cpu.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });

        it('can get an updated sound timer', () => {
            let soundTimer = 10;

            let expectedSoundTimer = 9;


            expect(cpu.getUpdatedSoundTimer(soundTimer)).equal(expectedSoundTimer);
        });
    });

    describe('opcode handling', () => {
        it('fetches opcode 0xANNN (0xA2F0)', () => {

            let memory = [
                0xA0,
                0xA1,
                0xA2,
                0xF0,
            ];

            let programCounter = 2;


            expect(cpu.fetchOpcode(memory, programCounter)).equal(0xA2F0);
        });

        it('decodes opcode 0xANNN (loadIndexRegister)', () => {
            cpu.programCounter = 4;


            cpu.decodeOpcode(0xA2F0);


            expect(cpu.indexRegister).equal(0x2F0);
            expect(cpu.programCounter).equal(6);
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

        it("decodes opcode 0xFX33 (storeDecimalValueVX)", () => {
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
