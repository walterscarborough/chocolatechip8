
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
});
