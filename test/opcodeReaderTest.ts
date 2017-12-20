import {expect} from 'chai';
import OpcodeReader from '../src/opcodeReader';

describe('OpcodeReader', () => {

    context('parsing', () => {
        it('decodes firstMask from opcode', () => {
            const opcode = 0xE000;


            const opcodeFirstMask = OpcodeReader.parseOpcodeFirstMask(opcode);


            expect(opcodeFirstMask).equal(0xE000);
        });

        it('decodes X register from opcode', () => {
            const opcode = 0x0F00;


            const decodedXRegister = OpcodeReader.parseOpcodeVX(opcode);


            expect(decodedXRegister).equal(0xF);
        });

        it('decodes Y register from opcode', () => {
            const opcode = 0x00F0;


            const decodedXRegister = OpcodeReader.parseOpcodeVY(opcode);


            expect(decodedXRegister).equal(0xF);
        });

        it('decodes N from opcode', () => {
            const opcode = 0x000F;


            const decodedXRegister = OpcodeReader.parseOpcodeN(opcode);


            expect(decodedXRegister).equal(0xF);
        });

        it('decodes NN from opcode', () => {
            const opcode = 0x00FF;


            const decodedXRegister = OpcodeReader.parseOpcodeNN(opcode);


            expect(decodedXRegister).equal(0xFF);
        });

        it('decodes NNN from opcode', () => {
            const opcode = 0x0FFF;


            const decodedXRegister = OpcodeReader.parseOpcodeNNN(opcode);


            expect(decodedXRegister).equal(0xFFF);
        });
    });

});