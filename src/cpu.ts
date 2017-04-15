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

    public decodeOpcode(opcode: number) {

        // We only care about the first letter in the opcode for switching purposes
        switch (opcode & 0xF000) {

            case 0x2000: {
                this.jumpToSubroutine(opcode);
                break;
            }

            case 0x8000: {
                switch (opcode & 0x000F) {

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
                switch (opcode & 0x00FF) {

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
                switch (opcode & 0x00FF) {

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
        const nnnAddress = opcode & 0x0FFF;
        this.indexRegister = nnnAddress;
        this.programCounter += 2;
    }

    private jumpToSubroutine(opcode: number) {
        this.stack[this.stackPointer] = this.programCounter;
        this.stackPointer += 1;
        this.programCounter = opcode & 0x0FFF;
    }

    private jumpWithV0Offset(opcode: number) {
        const nnnAddress = opcode & 0x0FFF;
        const v0Data = this.registers[0];
        this.programCounter = nnnAddress + v0Data;
    }

    private skipIfPressed(opcode: number) {
        const targetRegister = opcode & 0x0F00;
        const sourceKeyPress = this.registers[targetRegister];

        if (sourceKeyPress === this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private skipIfNotPressed(opcode: number) {
        const targetRegister = opcode & 0x0F00;
        const sourceKeyPress = this.registers[targetRegister];

        if (sourceKeyPress !== this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private storeDelayTimerToVX(opcode: number) {
        const targetRegister = opcode & 0x0F00;

        this.registers[targetRegister] = this.delayTimer;
    }

    private storeVXToDelayTimer(opcode: number) {
        const targetRegister = opcode & 0x0F00;

        this.delayTimer = this.registers[targetRegister];
    }

    private storeVXToSoundTimer(opcode: number) {
        const targetRegister = opcode & 0x0F00;

        this.soundTimer = this.registers[targetRegister];
    }

    private addVXToI(opcode: number) {
        const targetRegister = opcode & 0x0F00;

        this.indexRegister += this.registers[targetRegister];
    }

    private storeRandomNumberToVX(opcode: number) {
        const targetRegister = opcode & 0x0F00;
        const sourceNumber = opcode & 0x00FF;
        const randomNumber = this.getRandomIntMax255();

        const adjustedNumber = sourceNumber & randomNumber;

        this.registers[targetRegister] = adjustedNumber;
        this.programCounter += 2;
    }

    private startWaitForStoreKeypressToVX(opcode: number) {
        const targetRegister = opcode & 0x0F00;
        this.isHalted = true;
        this.hasPendingWaitForStoreKeypressToVX = true;
        this.pendingWaitForStoreKeypressToVXRegister = targetRegister;
    }

    private finishWaitForStoreKeypressToVX(targetRegister: number) {
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
    }

    private addWithCarry(opcode: number) {
        if (this.registers[(opcode & 0x00F0) >> 4] > (0xFF - this.registers[(opcode & 0x0F00) >> 8])) {
            this.registers[0xF] = 1;
        }
        else {
            this.registers[0xF] = 0;
        }

        this.registers[(opcode & 0x0F00) >> 8] += this.registers[(opcode & 0x00F0) >> 4];
        this.programCounter += 2;
    }

    private storeDecimalValueToVX(opcode: number) {
        this.memory[this.indexRegister] = Math.floor(this.registers[(opcode & 0x0F00) >> 8] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[(opcode & 0x0F00) >> 8] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[(opcode & 0x0F00) >> 8] % 100) % 10);

        this.programCounter += 2;
    }

    private getRandomIntMax255(): number {
        const max = 255;
        const min = 0;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
