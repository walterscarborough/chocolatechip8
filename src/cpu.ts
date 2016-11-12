export default class Cpu {

    currentOpcode: number = 0;
    memory: number[] = [];
    registers: number[] = [];
    indexRegister: number = 0;
    programCounter: number = 0;
    delayTimer: number = 0;
    soundTimer: number = 0;
    stack: number[] = [];
    stackPointer: number = 0;

}
