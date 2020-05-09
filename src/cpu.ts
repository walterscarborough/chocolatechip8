import OpcodeReader from './opcodeReader';
import RandomNumberGenerator from './randomNumberGenerator';
import OpcodeDecoder from './opcodeDecoder';
import {Opcodes} from './opcodes';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as log from 'loglevel';

export default class Cpu {

    currentOpcode: number = 0;
    memory: number[] = Cpu.initializeArrayToZero(4096);
    registers: number[] = Cpu.initializeArrayToZero(16);
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
    graphicsOutput: Array<number> = Cpu.initializeArrayToZero(64 * 32);

    private static initializeArrayToZero(length: number): number[] {
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, new Array(length)).map(() => 0);
    }

    public loadGame(game: Uint8Array): void {

        for (let i = 0; i < game.length; i++) {
            this.memory[0x200 + i] = game[i];
        }

        let counter = 0;
        while (counter < 6) {
            counter++;

            this.emulateCycle();
        }
    }

    public keypress(key: number): void {

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

        log.debug('opcode is: ' + opcode.toString(16));

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

    public decodeOpcode(opcode: number): void {

        const decodedOpcode = OpcodeDecoder.decodeOpcode(opcode);

        switch (decodedOpcode.toString()) {
        case Opcodes.SET_VX_TO_BITWISE_AND_VY.toString(): {
            this.setVXToBitwiseAndVY(opcode);
            break;
        }
        case Opcodes.SET_VX_TO_BITWISE_OR_VY.toString(): {
            this.setVXToBitwiseOrVY(opcode);
            break;
        }
        case Opcodes.SET_VX_TO_BITWISE_X_OR_VY.toString(): {
            this.setVXToBitwiseXorVY(opcode);
            break;
        }
        case Opcodes.SET_VX_TO_VY.toString(): {
            this.setVXToVY(opcode);
            break;
        }
        case Opcodes.SUBTRACT_VY_FROM_VX_WITH_CARRY.toString(): {
            this.subtractVYFromVXWithCarry(opcode);
            break;
        }
        case Opcodes.SUBTRACT_VX_FROM_VY_WITH_CARRY.toString(): {
            this.subtractVXFromVYWithCarry(opcode);
            break;
        }
        case Opcodes.ADD_NN_TO_VX.toString(): {
            this.addNNToVX(opcode);
            break;
        }
        case Opcodes.SET_VX_TO_NN.toString(): {
            this.setVXToNN(opcode);
            break;
        }
        case Opcodes.SHIFT_VX_RIGHT.toString(): {
            this.shiftVXRight(opcode);
            break;
        }
        case Opcodes.SKIP_IF_VX_EQUALS_VY.toString(): {
            this.skipIfVXEqualsVY(opcode);
            break;
        }
        case Opcodes.SKIP_IF_VX_DOES_NOT_EQUAL_NN.toString(): {
            this.skipIfVXDoesNotEqualNN(opcode);
            break;
        }
        case Opcodes.SKIP_IF_VX_EQUALS_NN.toString(): {
            this.skipIfVXEqualsNN(opcode);
            break;
        }
        case Opcodes.RETURN_FROM_SUBROUTINE.toString(): {
            this.returnFromSubroutine(opcode);
            break;
        }
        case Opcodes.JUMP_TO_ADDRESS.toString(): {
            this.jumpToAddress(opcode);
            break;
        }
        case Opcodes.LOAD_INDEX_REGISTER.toString(): {
            this.loadIndexRegister(opcode);
            break;
        }
        case Opcodes.JUMP_TO_SUBROUTINE.toString(): {
            this.jumpToSubroutine(opcode);
            break;
        }
        case Opcodes.JUMP_WITH_V0_OFFSET.toString(): {
            this.jumpWithV0Offset(opcode);
            break;
        }
        case Opcodes.SKIP_IF_PRESSED.toString(): {
            this.skipIfPressed(opcode);
            break;
        }
        case Opcodes.SKIP_IF_NOT_PRESSED.toString(): {
            this.skipIfNotPressed(opcode);
            break;
        }
        case Opcodes.STORE_DELAY_TIMER_TO_VX.toString(): {
            this.storeDelayTimerToVX(opcode);
            break;
        }
        case Opcodes.STORE_VX_TO_DELAY_TIMER.toString(): {
            this.storeVXToDelayTimer(opcode);
            break;
        }
        case Opcodes.STORE_VX_TO_SOUND_TIMER.toString(): {
            this.storeVXToSoundTimer(opcode);
            break;
        }
        case Opcodes.ADD_VX_TO_I.toString(): {
            this.addVXToI(opcode);
            break;
        }
        case Opcodes.STORE_RANDOM_NUMBER_TO_VX.toString(): {
            this.storeRandomNumberToVX(opcode);
            break;
        }
        case Opcodes.DRAW_VX_VY.toString(): {
            this.drawVxVy(opcode);
            break;
        }
        case Opcodes.START_WAIT_FOR_STORE_KEYPRESS_TO_VX.toString(): {
            this.startWaitForStoreKeypressToVX(opcode);
            break;
        }
        case Opcodes.ADD_WITH_CARRY.toString(): {
            this.addWithCarry(opcode);
            break;
        }
        case Opcodes.STORE_DECIMAL_VALUE_TO_VX.toString(): {
            this.storeDecimalValueToVX(opcode);
            break;
        }
        case Opcodes.STORE_FROM_V0_VX_TO_MEMORY.toString(): {
            this.storeFromV0VXToMemory(opcode);
            break;
        }
        case Opcodes.STORE_FROM_MEMORY_TO_V0_VX.toString(): {
            this.storeFromMemoryToV0VX(opcode);
            break;
        }
        default: {
            throw new Error('Error: cpu found unknown opcode')
        }
        }
    }


    private setVXToBitwiseAndVY(opcode: number): void {
        log.debug('call setVXToBitwiseAndVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] & this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseOrVY(opcode: number): void {
        log.debug('call setVXToBitwiseOrVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] | this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToBitwiseXorVY(opcode: number): void {
        log.debug('call setVXToBitwiseXorVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] ^ this.registers[vY];
        this.programCounter += 2;
    }

    private setVXToVY(opcode: number): void {
        log.debug('call setVXToVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vY];
        this.programCounter += 2;
    }

    private subtractVYFromVXWithCarry(opcode: number): void {
        log.debug('call subtractVYFromVXWithCarry');
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

    private subtractVXFromVYWithCarry(opcode: number): void {
        log.debug('call subtractVXFromVYWithCarry');
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

    private addNNToVX(opcode: number): void {
        log.debug('call addNNToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nn = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] += nn;
        this.programCounter += 2;
    }

    private setVXToNN(opcode: number): void {
        log.debug('call setVXToNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] = nnAddress;
        this.programCounter += 2;
    }

    private shiftVXRight(opcode: number): void {
        log.debug('call shiftVXRight');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.registers[0xF] = this.registers[vX] & 0x1;

        this.registers[vX] = this.registers[vX] >> 1;
        this.programCounter += 2;
    }

    private skipIfVXEqualsVY(opcode: number): void {
        log.debug('call skipIfVXEqualsVY');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        if (this.registers[vX] === this.registers[vY]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXDoesNotEqualNN(opcode: number): void {
        log.debug('call skipIfVXDoesNotEqualNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress !== this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private skipIfVXEqualsNN(opcode: number): void {
        log.debug('call skipIfVXEqualsNN');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress === this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private returnFromSubroutine(opcode: number): void {
        log.debug('call returnFromSubroutine');
        this.programCounter = this.stack[this.stackPointer];
        this.stackPointer -= 1;
    }

    private jumpToAddress(opcode: number): void {
        log.debug('call jumpToAddress');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.programCounter = nnnAddress;
    }

    private loadIndexRegister(opcode: number): void {
        log.debug('call loadIndexRegister');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.indexRegister = nnnAddress;
        this.programCounter += 2;
    }

    private jumpToSubroutine(opcode: number): void {
        log.debug('call jumpToSubroutine');
        this.stack[this.stackPointer] = this.programCounter;
        this.stackPointer += 1;
        this.programCounter = OpcodeReader.parseOpcodeNNN(opcode);
    }

    private jumpWithV0Offset(opcode: number): void {
        log.debug('call jumpWithV0Offset');
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        const v0Data = this.registers[0];
        this.programCounter = nnnAddress + v0Data;
    }

    private skipIfPressed(opcode: number): void {
        log.debug('call skipIfPressed');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress === this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private skipIfNotPressed(opcode: number): void {
        log.debug('call skipIfNotPressed');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress !== this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private storeDelayTimerToVX(opcode: number): void {
        log.debug('call storeDelayTimerToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.registers[vX] = this.delayTimer;
        this.programCounter += 2;
    }

    private storeVXToDelayTimer(opcode: number): void {
        log.debug('call storeVXToDelayTimer');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.delayTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private storeVXToSoundTimer(opcode: number): void {
        log.debug('call storeVXToSoundTimer');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.soundTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private addVXToI(opcode: number): void {
        log.debug('call addVXToI');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.indexRegister += this.registers[vX];
        this.programCounter += 2
    }

    private storeRandomNumberToVX(opcode: number): void {
        log.debug('call storeRandomNumberToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceNumber = OpcodeReader.parseOpcodeNN(opcode);
        const randomNumber = RandomNumberGenerator.getRandomIntMax255();

        const adjustedNumber = sourceNumber & randomNumber;

        this.registers[vX] = adjustedNumber;
        this.programCounter += 2;
    }

    private drawVxVy(opcode: number): void {
        log.debug('call drawDxDy');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);
        const height = OpcodeReader.parseOpcodeN(opcode);

        for (let yLine = 0; yLine < height; yLine++) {
            const pixel = this.memory[this.indexRegister + yLine];

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

    private startWaitForStoreKeypressToVX(opcode: number): void {
        log.debug('call startWaitForStoreKeypressToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        this.isHalted = true;
        this.hasPendingWaitForStoreKeypressToVX = true;
        this.pendingWaitForStoreKeypressToVXRegister = vX;
    }

    public finishWaitForStoreKeypressToVX(targetRegister: number) {
        log.debug('call finishWaitForStoreKeypressToVX');
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
        this.programCounter += 2
    }

    private addWithCarry(opcode: number): void {
        log.debug('call addWithCarry');
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

    private storeDecimalValueToVX(opcode: number): void {
        log.debug('call storeDecimalValueToVX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.memory[this.indexRegister] = Math.floor(this.registers[vX] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[vX] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[vX] % 100) % 10);

        this.programCounter += 2;
    }

    private storeFromV0VXToMemory(opcode: number): void {
        log.debug('call storeFromV0VXToMemory');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.memory[counter + this.indexRegister] = this.registers[counter];
        }

        this.programCounter += 2;
    }

    private storeFromMemoryToV0VX(opcode: number): void {
        log.debug('call storeFromMemoryToV0VX');
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.registers[counter] = this.memory[this.indexRegister + vX];
        }

        this.programCounter += 2;
    }
}
