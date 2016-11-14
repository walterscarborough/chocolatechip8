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

    public fetchOpcode(memory: number[], programCounter: number): number {
        let opcodeFragmentA: number = memory[programCounter];
        let opcodeFragmentB: number = memory[programCounter + 1];


        let leftShiftedOpcodeFragmentA = opcodeFragmentA << 8;


        let completeOpcode = leftShiftedOpcodeFragmentA | opcodeFragmentB;

        return completeOpcode;
    }

    public decodeOpcode(opcode: number) {

        // We only care about the first letter in the opcode for switching purposes
        switch (opcode & 0xF000) {

            // ANNN: sets indexRegister to address NNN
            case 0xA000:
                let nnnAddress = opcode & 0x0FFF;
                this.indexRegister = nnnAddress;
                this.programCounter += 2;

                break;

            case 0x2000:
                this.stack[this.stackPointer] = this.programCounter;
                this.stackPointer += 1;
                this.programCounter = opcode & 0x0FFF;

                break;

            default:
                console.log('opcode "' + opcode + '" not implemented!');

                break;
        }

    }

    public getUpdatedDelayTimer(delayTimer: number): number {
        if (delayTimer > 0) {
            delayTimer -= 1;
        }

        return delayTimer;
    }

    public getUpdatedSoundTimer(soundTimer: number): number {
        if (soundTimer > 0) {

            if (soundTimer == 1) {
                console.log("beep!");
            }

            soundTimer -= 1;
        }

        return soundTimer;
    }
}
