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

            // ANNN: sets indexRegister to address NNN
            case 0xA000: {
                this.loadIndexRegister(opcode);
                break;
            }

            case 0xB000: {
                this.jumpWithV0Offset(opcode);
                break;
            }

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

            case 0xF000: {
                switch (opcode & 0x00FF) {

                    case 0x0033: {
                        this.storeDecimalValueVX(opcode);
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

    private storeDecimalValueVX(opcode: number) {
        this.memory[this.indexRegister] = Math.floor(this.registers[(opcode & 0x0F00) >> 8] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[(opcode & 0x0F00) >> 8] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[(opcode & 0x0F00) >> 8] % 100) % 10);

        this.programCounter += 2;
    }
}
