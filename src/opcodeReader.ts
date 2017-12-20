export default class OpcodeReader {
    public static parseOpcodeFirstMask(opcode: number): number {
        const opcodeFirstMask = opcode & 0xF000;

        return opcodeFirstMask;
    }

    public static parseOpcodeVX(opcode: number): number {
        const vX = (opcode & 0x0F00) >> 8;

        return vX;
    }

    public static parseOpcodeVY(opcode: number): number {
        const vY = (opcode & 0x00F0) >> 4;

        return vY;
    }

    public static parseOpcodeN(opcode: number): number {
        const n = opcode & 0x000F;

        return n;
    }

    public static parseOpcodeNN(opcode: number): number {
        const nn = opcode & 0x00FF;

        return nn;
    }

    public static parseOpcodeNNN(opcode: number): number {
        const nn = opcode & 0x0FFF;

        return nn;
    }
}