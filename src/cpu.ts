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

            case 0x0000: {
                switch (this.parseOpcodeNN(opcode)) {

                    case 0x00EE: {
                        this.returnFromSubroutine(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode + '" not implemented!');
                        break;
                    }
                }
                break;
            }

            case 0x1000: {
                this.jumpToAddress(opcode);
                break;
            }

            case 0x2000: {
                this.jumpToSubroutine(opcode);
                break;
            }

            case 0x3000: {
                this.skipIfVXEqualsNN(opcode);
                break;
            }

            case 0x4000: {
                this.skipIfVXDoesNotEqualNN(opcode);
                break;
            }

            case 0x5000: {
                this.skipIfVXEqualsVY(opcode);
                break;
            }

            case 0x6000: {
                this.setVXToNN(opcode);
                break;
            }

            case 0x7000: {
                this.addNNToVX(opcode);
                break;
            }

            case 0x8000: {
                switch (this.parseOpcodeN(opcode)) {

                    case 0x0000: {
                        this.setVXToVY(opcode);
                        break;
                    }

                    case 0x0001: {
                        this.setVXToBitwiseOrVY(opcode);
                        break;
                    }

                    case 0x0002: {
                        this.setVXToBitwiseAndVY(opcode);
                        break;
                    }

                    case 0x0003: {
                        this.setVXToBitwiseXorVY(opcode);
                        break;
                    }

                    case 0x0004: {
                        this.addWithCarry(opcode);
                        break;
                    }

                    case 0x0005: {
                        this.subtractVYFromVXWithCarry(opcode);
                        break;
                    }

                    case 0x0006: {
                        this.shiftVXRight(opcode);
                        break;
                    }

                    case 0x0007: {
                        this.subtractVXFromVYWithCarry(opcode);
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

    private setVXToBitwiseAndVY(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] & this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseOrVY(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] | this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseXorVY(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] ^ this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToVY(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vY];
        this.programCounter += 2;
    }

    private subtractVYFromVXWithCarry(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        if (this.registers[vX] < this.registers[vY]) {
            this.registers[0xF] = 1;
        }
        else {
            this.registers[0xF] = 0;
        }

        this.registers[vX] = this.registers[vX] - this.registers[vY];
        this.programCounter += 2;
    }

    private subtractVXFromVYWithCarry(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        if (this.registers[vX] < this.registers[vY]) {
            this.registers[0xF] = 0;
        }
        else {
            this.registers[0xF] = 1;
        }

        this.registers[vX] = this.registers[vY] - this.registers[vX];
        this.programCounter += 2;
    }

    private addNNToVX(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const nn = this.parseOpcodeNN(opcode);

        this.registers[vX] += nn;
        this.programCounter += 2;
    }

    private setVXToNN(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const nnAddress = this.parseOpcodeNN(opcode);

        this.registers[vX] = nnAddress;
        this.programCounter += 2;
    }

    private shiftVXRight(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.registers[0xF] = this.registers[vX] & 0x1;

        this.registers[vX] = this.registers[vX] >> 1;
        this.programCounter += 2;
    }

    private skipIfVXEqualsVY(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const vY = this.parseOpcodeVY(opcode);

        if (this.registers[vX] === this.registers[vY]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXDoesNotEqualNN(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const nnAddress = this.parseOpcodeNN(opcode);

        if (nnAddress !== this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXEqualsNN(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);
        const nnAddress = this.parseOpcodeNN(opcode);

        if (nnAddress === this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private returnFromSubroutine(opcode: number) {
        this.programCounter = this.stack[this.stackPointer];
        this.stackPointer -= 1;
    }

    private jumpToAddress(opcode: number) {
        const nnnAddress = this.parseOpcodeNNN(opcode);
        this.programCounter = nnnAddress;
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
        this.programCounter += 2;
    }

    private storeVXToDelayTimer(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.delayTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private storeVXToSoundTimer(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.soundTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private addVXToI(opcode: number) {
        const vX = this.parseOpcodeVX(opcode);

        this.indexRegister += this.registers[vX];
        this.programCounter += 2
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

    public finishWaitForStoreKeypressToVX(targetRegister: number) {
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
        this.programCounter += 2
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

    public getRandomIntMax255(): number {
        const max = 255;
        const min = 0;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
