
import { expect } from 'chai';
import Cpu from '../src/cpu';

describe('Cpu', () => {
    var cpu : Cpu;

    beforeEach(function () {
        cpu = new Cpu();
    });

    describe('#initial values', () => {
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

    describe('#opcode handling', () => {
        it('fetches opcode 0xA2F0', () => {

            let memory = [
                0xA0,
                0xA1,
                0xA2,
                0xF0,
            ];

            let programCounter = 2;

            expect(cpu.fetchOpcode(memory, programCounter)).equal(0xA2F0);
        });

        it('decodes opcode 0xA2F0', () => {
            let memory = [
                0xA0,
                0xA1,
                0xA2,
                0xF0,
            ];

            let programCounter = 2;

            cpu.decodeOpcode(0xA2F0);

            expect(cpu.indexRegister).equal(0x2F0);
            expect(cpu.programCounter).equal(2);
        });
    });

    describe('#timer handling', () => {
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
});
