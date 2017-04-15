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

    currentKeyPressed: number = 0;
    isHalted: boolean = false;

    hasPendingWaitForStoreKeypressToVX: boolean = false;
    pendingWaitForStoreKeypressToVXRegister: number = 0;

    public keypress(key: number) {

        this.currentKeyPressed = key;

        if (this.hasPendingWaitForStoreKeypressToVX === true) {
            this.finishWaitForStoreKeypressToVX(this.pendingWaitForStoreKeypressToVXRegister);
        }
    }
    /*
    public emulateCycle(): void {
        // fetch opcode
        // decode opcode
        // execute opcode

        // update timers
        delayTimer = this.getUpdatedDelayTimer(this.delayTimer);
        soundTimer = this.getUpdatedSoundTimer(this.soundTimer);
    }
    */

    public getUpdatedDelayTimer(delayTimer: number): number {
        if (delayTimer > 0) {
            delayTimer -= 1;
        }

        return delayTimer;
    }

    public getUpdatedSoundTimer(soundTimer: number): number {
        if (soundTimer > 0) {

            if (soundTimer == 1) {
                console.log('beep!');
            }

            soundTimer -= 1;
        }

        return soundTimer;
    }


    public fetchOpcode(memory: number[], programCounter: number): number {
        const opcodeFragmentA: number = memory[programCounter];
        const opcodeFragmentB: number = memory[programCounter + 1];


        const leftShiftedOpcodeFragmentA = opcodeFragmentA << 8;


        const completeOpcode = leftShiftedOpcodeFragmentA | opcodeFragmentB;

        return completeOpcode;
    }
    
    public parseOpcodeFirstMask(opcode: number): number {
        const opcodeFirstMask = opcode & 0xF000;

        return opcodeFirstMask;
    }

    public parseOpcodeVX(opcode: number): number {
        const vX = (opcode & 0x0F00) >> 8;

        return vX;
    }

    public parseOpcodeVY(opcode: number): number {
        const vY = (opcode & 0x00F0) >> 4;

        return vY;
    }

    public parseOpcodeN(opcode: number): number {
        const n = opcode & 0x000F;

        return n;
    }

    public parseOpcodeNN(opcode: number): number {
        const nn = opcode & 0x00FF;

        return nn;
    }

    public parseOpcodeNNN(opcode: number): number {
        const nn = opcode & 0x0FFF;

        return nn;
    }

    public decodeOpcode(opcode: number) {

        // We only care about the first letter in the opcode for switching purposes
        switch (this.parseOpcodeFirstMask(opcode)) {

            case 0x2000: {
                this.jumpToSubroutine(opcode);
                break;
            }

            case 0x8000: {
                switch (this.parseOpcodeN(opcode)) {

                    case 0x0004: {
                        this.addWithCarry(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode + '" not implemented!');
                        break;
                    }
                }

                break;
            }

            case 0xA000: {
                this.loadIndexRegister(opcode);
                break;
            }

            case 0xB000: {
                this.jumpWithV0Offset(opcode);
                break;
            }

            case 0xC000: {
                this.storeRandomNumberToVX(opcode);
                break;
            }

            case 0xE000: {
                switch (this.parseOpcodeNN(opcode)) {

                    case 0x009E: {
                        this.skipIfPressed(opcode);
                        break;
                    }

                    case 0x00A1: {
                        this.skipIfNotPressed(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode + '" not implemented!');
                        break;
                    }
                }

                break;
            }

            case 0xF000: {
                switch (this.parseOpcodeNN(opcode)) {

                    case 0x0007: {
                        this.storeDelayTimerToVX(opcode);
                        break;
                    }

                    case 0x000A: {
                        this.startWaitForStoreKeypressToVX(opcode);
                        break;
                    }

                    case 0x0015: {
                        this.storeVXToDelayTimer(opcode);
                        break;
                    }

                    case 0x0018: {
                        this.storeVXToSoundTimer(opcode);
                        break;
                    }

                    case 0x001E: {
                        this.addVXToI(opcode);
                        break;
                    }

                    case 0x0033: {
                        this.storeDecimalValueToVX(opcode);
                        break;
                    }

                    case 0x0055: {
                        this.storeFromV0VXToMemory(opcode);
                        break;
                    }

                    case 0x0065: {
                        this.storeFromMemoryToV0VX(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode + '" not implemented!');
                        break;
                    }
                }

                break;
            }

            default: {
                console.log('opcode "' + opcode + '" not implemented!');
                break;
            }
        }
    }

    private loadIndexRegister(opcode: number) {
        const nnnAddress = this.parseOpcodeNNN(opcode);
        this.indexRegister = nnnAddress;
        this.programCounter += 2;
    }

    private jumpToSubroutine(opcode: number) {
        this.stack[this.stackPointer] = this.programCounter;
        this.stackPointer += 1;
        this.programCounter = this.parseOpcodeNNN(opcode);
    }

    private jumpWithV0Offset(opcode: number) {
        const nnnAddress = this.parseOpcodeNNN(opcode);
        const v0Data = this.registers[0];
        this.programCounter = nnnAddress + v0Data;
    }

    private skipIfPressed(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress === this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private skipIfNotPressed(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

       const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress !== this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private storeDelayTimerToVX(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.registers[vX] = this.delayTimer;
    }

    private storeVXToDelayTimer(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.delayTimer = this.registers[vX];
    }

    private storeVXToSoundTimer(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.soundTimer = this.registers[vX];
    }

    private addVXToI(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.indexRegister += this.registers[vX];
    }

    private storeRandomNumberToVX(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const sourceNumber = this.parseOpcodeNN(opcode);
        const randomNumber = this.getRandomIntMax255();

        const adjustedNumber = sourceNumber & randomNumber;

        this.registers[vX] = adjustedNumber;
        this.programCounter += 2;
    }

    private startWaitForStoreKeypressToVX(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        this.isHalted = true;
        this.hasPendingWaitForStoreKeypressToVX = true;
        this.pendingWaitForStoreKeypressToVXRegister = vX;
    }

    private finishWaitForStoreKeypressToVX(targetRegister: number) {
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
    }

    private addWithCarry(opcode: number) {

        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        if (this.registers[vY] > (0xFF - this.registers[vX])) {
            this.registers[0xF] = 1;
        }
        else {
            this.registers[0xF] = 0;
        }

        this.registers[vX] += this.registers[vY];
        this.programCounter += 2;
    }

    private storeDecimalValueToVX(opcode: number) {

        const vX = this.parseOpcodeVX(opcode);

        this.memory[this.indexRegister] = Math.floor(this.registers[vX] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[vX] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[vX] % 100) % 10);

        this.programCounter += 2;
    }

    private storeFromV0VXToMemory(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.memory[counter + this.indexRegister] = this.registers[counter]; 
        }

        this.programCounter += 2;
    }

    private storeFromMemoryToV0VX(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        
        for (let counter = 0; counter <= vX; counter++) {
            this.registers[counter] = this.memory[this.indexRegister + vX];
        }

        this.programCounter += 2;
    }

    private getRandomIntMax255(): number {
        const max = 255;
        const min = 0;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
