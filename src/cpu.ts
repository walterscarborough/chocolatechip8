import OpcodeReader from './opcodeReader';
import RandomNumberGenerator from './randomNumberGenerator';
import {log} from 'util';

export default class Cpu {

    currentOpcode: number = 0;
    memory: number[] = this.initializeArrayToZero(4096);
    registers: number[] = this.initializeArrayToZero(16);
    indexRegister: number = 0;
    programCounter: number = 0x200;
    delayTimer: number = 0;
    soundTimer: number = 0;
    stack: number[] = [];
    stackPointer: number = 0;

    currentKeyPressed: number = 0;
    isHalted: boolean = false;

    hasPendingWaitForStoreKeypressToVX: boolean = false;
    pendingWaitForStoreKeypressToVXRegister: number = 0;
    graphicsOutput: Array<number> = this.initializeArrayToZero(64 * 32);

    private initializeArrayToZero(length: number): number[] {
        return Array.apply(null, new Array(length)).map(() => 0);
    }

    public loadGame(game: Uint8Array) {

        for (let i = 0; i < game.length; i++) {
            this.memory[0x200 + i] = game[i];
        }

        let counter = 0;
        while (counter < 6) {
            counter++;

            this.emulateCycle();
        }
    }

    public keypress(key: number) {

        this.currentKeyPressed = key;

        if (this.hasPendingWaitForStoreKeypressToVX === true) {
            this.finishWaitForStoreKeypressToVX(this.pendingWaitForStoreKeypressToVXRegister);
        }
    }

    public emulateCycle(): void {

        // fetch opcode
        // decode opcode
        // execute opcode
        const opcode = this.fetchOpcode(this.memory, this.programCounter);
        this.decodeOpcode(opcode);

        log('opcode is: ' + opcode.toString(16));

        // update timers
        // delayTimer = this.updateDelayTimer(this.delayTimer);
        // soundTimer = this.updateSoundTimer(this.soundTimer);
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
        switch (OpcodeReader.parseOpcodeFirstMask(opcode)) {

            case 0x0000: {
                switch (OpcodeReader.parseOpcodeNN(opcode)) {

                    case 0x00EE: {
                        this.returnFromSubroutine(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode.toString(16) + '" not implemented!');
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
                switch (OpcodeReader.parseOpcodeN(opcode)) {

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
                        console.log('opcode "' + opcode.toString(16) + '" not implemented!');
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

            case 0xD000: {
                this.drawVxVy(opcode);
                break;
            }

            case 0xE000: {
                switch (OpcodeReader.parseOpcodeNN(opcode)) {

                    case 0x009E: {
                        this.skipIfPressed(opcode);
                        break;
                    }

                    case 0x00A1: {
                        this.skipIfNotPressed(opcode);
                        break;
                    }

                    default: {
                        console.log('opcode "' + opcode.toString(16) + '" not implemented!');
                        break;
                    }
                }

                break;
            }

            case 0xF000: {
                switch (OpcodeReader.parseOpcodeNN(opcode)) {

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
                        console.log('opcode "' + opcode.toString(16) + '" not implemented!');
                        break;
                    }
                }

                break;
            }

            default: {
                console.log('opcode "' + opcode.toString(16) + '" not implemented!');
                break;
            }
        }
    }

    private setVXToBitwiseAndVY(opcode: number) {
        log('call setVXToBitwiseAndVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] & this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseOrVY(opcode: number) {
        log('call setVXToBitwiseOrVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] | this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseXorVY(opcode: number) {
        log('call setVXToBitwiseXorVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] ^ this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToVY(opcode: number) {
        log('call setVXToVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vY];
        this.programCounter += 2;
    }

    private subtractVYFromVXWithCarry(opcode: number) {
        log('call subtractVYFromVXWithCarry');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

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
        log('call subtractVXFromVYWithCarry');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

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
        log('call addNNToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nn = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] += nn;
        this.programCounter += 2;
    }

    private setVXToNN(opcode: number) {
        log('call setVXToNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] = nnAddress;
        this.programCounter += 2;
    }

    private shiftVXRight(opcode: number) {
        log('call shiftVXRight');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.registers[0xF] = this.registers[vX] & 0x1;

        this.registers[vX] = this.registers[vX] >> 1;
        this.programCounter += 2;
    }

    private skipIfVXEqualsVY(opcode: number) {
        log('call skipIfVXEqualsVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        if (this.registers[vX] === this.registers[vY]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXDoesNotEqualNN(opcode: number) {
        log('call skipIfVXDoesNotEqualNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress !== this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXEqualsNN(opcode: number) {
        log('call skipIfVXEqualsNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress === this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private returnFromSubroutine(opcode: number) {
        log('call returnFromSubroutine');
        this.programCounter = this.stack[this.stackPointer];
        this.stackPointer -= 1;
    }

    private jumpToAddress(opcode: number) {
        log('call jumpToAddress');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.programCounter = nnnAddress;
    }

    private loadIndexRegister(opcode: number) {
        log('call loadIndexRegister');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.indexRegister = nnnAddress;
        this.programCounter += 2;
    }

    private jumpToSubroutine(opcode: number) {
        log('call jumpToSubroutine');
        this.stack[this.stackPointer] = this.programCounter;
        this.stackPointer += 1;
        this.programCounter = OpcodeReader.parseOpcodeNNN(opcode);
    }

    private jumpWithV0Offset(opcode: number) {
        log('call jumpWithV0Offset');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        const v0Data = this.registers[0];
        this.programCounter = nnnAddress + v0Data;
    }

    private skipIfPressed(opcode: number) {
        log('call skipIfPressed');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress === this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private skipIfNotPressed(opcode: number) {
        log('call skipIfNotPressed');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress !== this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private storeDelayTimerToVX(opcode: number) {
        log('call storeDelayTimerToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.registers[vX] = this.delayTimer;
        this.programCounter += 2;
    }

    private storeVXToDelayTimer(opcode: number) {
        log('call storeVXToDelayTimer');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.delayTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private storeVXToSoundTimer(opcode: number) {
        log('call storeVXToSoundTimer');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.soundTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private addVXToI(opcode: number) {
        log('call addVXToI');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.indexRegister += this.registers[vX];
        this.programCounter += 2
    }

    private storeRandomNumberToVX(opcode: number) {
        log('call storeRandomNumberToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceNumber = OpcodeReader.parseOpcodeNN(opcode);
        const randomNumber = RandomNumberGenerator.getRandomIntMax255();

        const adjustedNumber = sourceNumber & randomNumber;

        this.registers[vX] = adjustedNumber;
        this.programCounter += 2;
    }

    private drawVxVy(opcode: number) {
        log('call drawDxDy');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);
        const height = OpcodeReader.parseOpcodeN(opcode);

        for (let yLine = 0; yLine < height; yLine++) {
            let pixel = this.memory[this.indexRegister + yLine];

            for (let xLine = 0; xLine < 8; xLine++) {
                if ((pixel & (0x80 >> xLine)) != 0) {

                    if (this.graphicsOutput[(vX + xLine + ((vY + yLine) * 64))] == 1) {
                        this.registers[0xF] = 1;
                    }

                    this.graphicsOutput[vX + xLine + ((vY + yLine) * 64)] ^= 1;
                }
            }
        }

        this.programCounter += 2;
    }

    private startWaitForStoreKeypressToVX(opcode: number) {
        log('call startWaitForStoreKeypressToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        this.isHalted = true;
        this.hasPendingWaitForStoreKeypressToVX = true;
        this.pendingWaitForStoreKeypressToVXRegister = vX;
    }

    public finishWaitForStoreKeypressToVX(targetRegister: number) {
        log('call finishWaitForStoreKeypressToVX');
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
        this.programCounter += 2
    }

    private addWithCarry(opcode: number) {
        log('call addWithCarry');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

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
        log('call storeDecimalValueToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.memory[this.indexRegister] = Math.floor(this.registers[vX] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[vX] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[vX] % 100) % 10);

        this.programCounter += 2;
    }

    private storeFromV0VXToMemory(opcode: number) {
        log('call storeFromV0VXToMemory');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.memory[counter + this.indexRegister] = this.registers[counter];
        }

        this.programCounter += 2;
    }

    private storeFromMemoryToV0VX(opcode: number) {
        log('call storeFromMemoryToV0VX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.registers[counter] = this.memory[this.indexRegister + vX];
        }

        this.programCounter += 2;
    }
}
