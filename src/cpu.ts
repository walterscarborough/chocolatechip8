import OpcodeReader from './opcodeReader';
import RandomNumberGenerator from './randomNumberGenerator';
import OpcodeDecoder from './opcodeDecoder';
import {Opcodes} from './opcodes';
import {Display} from "./display/display";
import {font} from "./font";

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
    display: Display;


    constructor(display: Display) {
        this.display = display;
        this.display.initializeDisplay();
    }

    private static initializeArrayToZero(length: number): number[] {
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, new Array(length)).map(() => 0);
    }

    public loadGame(game: Uint8Array): void {

        console.log('loadGame called');

        for (let i = 0; i < font.length; i++) {
            this.memory[i] = font[i];
        }

        for (let i = 0; i < game.length; i++) {
            this.memory[0x200 + i] = game[i];
        }

        let counter = 0;
        while (counter < 20) {
            counter++;

            this.emulateCycle();
        }

        console.log('emulateCycle ended');
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

        console.log('EMULATE_CYCLE opcode is: ' + opcode.toString(16));

        this.decodeOpcode(opcode);


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
        case Opcodes.OPCODE_00E0_CLEAR_DISPLAY.toString(): {
            this.executeOpcode_00E0_clearDisplay();
            break;
        }
        case Opcodes.OPCODE_8XY2_SET_VX_TO_BITWISE_AND_VY.toString(): {
            this.executeOpcode_8XY2_setVXToBitwiseAndVY(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY1_SET_VX_TO_BITWISE_OR_VY.toString(): {
            this.executeOpcode_8XY1_setVXToBitwiseOrVY(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY3_SET_VX_TO_BITWISE_X_OR_VY.toString(): {
            this.executeOpcode_8XY3_setVXToBitwiseXorVY(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY0_SET_VX_TO_VY.toString(): {
            this.executeOpcode_8XY0_setVXToVY(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY5_SUBTRACT_VY_FROM_VX_WITH_CARRY.toString(): {
            this.executeOpcode_8XY5_subtractVYFromVXWithCarry(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY7_SUBTRACT_VX_FROM_VY_WITH_CARRY.toString(): {
            this.executeOpcode_8XY7_subtractVXFromVYWithCarry(opcode);
            break;
        }
        case Opcodes.OPCODE_7XNN_ADD_NN_TO_VX.toString(): {
            this.executeOpcode_7XNN_addNNToVX(opcode);
            break;
        }
        case Opcodes.OPCODE_6XNN_SET_VX_TO_NN.toString(): {
            this.executeOpcode_6XNN_setVXToNN(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY6_SHIFT_RIGHT_VX_VY.toString(): {
            this.executeOpcode_8XY6_shiftRightVxVy(opcode);
            break;
        }
        case Opcodes.OPCODE_5XY0_SKIP_IF_VX_EQUALS_VY.toString(): {
            this.executeOpcode_5XY0_skipIfVXEqualsVY(opcode);
            break;
        }
        case Opcodes.OPCODE_4XNN_SKIP_IF_VX_DOES_NOT_EQUAL_NN.toString(): {
            this.executeOpcode_4XNN_skipIfVXDoesNotEqualNN(opcode);
            break;
        }
        case Opcodes.OPCODE_3XNN_SKIP_IF_VX_EQUALS_NN.toString(): {
            this.executeOpcode_3XNN_skipIfVXEqualsNN(opcode);
            break;
        }
        case Opcodes.OPCODE_00EE_RETURN_FROM_SUBROUTINE.toString(): {
            this.executeOpcode_00EE_returnFromSubroutine(opcode);
            break;
        }
        case Opcodes.OPCODE_1NNN_JUMP_TO_ADDRESS.toString(): {
            this.executeOpcode_1NNN_jumpToAddress(opcode);
            break;
        }
        case Opcodes.OPCODE_ANNN_LOAD_INDEX_REGISTER.toString(): {
            this.executeOpcode_ANNN_loadIndexRegister(opcode);
            break;
        }
        case Opcodes.OPCODE_2NNN_JUMP_TO_SUBROUTINE.toString(): {
            this.executeOpcode_2NNN_jumpToSubroutine(opcode);
            break;
        }
        case Opcodes.OPCODE_BNNN_JUMP_WITH_V0_OFFSET.toString(): {
            this.executeOpcode_BNNN_jumpWithV0Offset(opcode);
            break;
        }
        case Opcodes.OPCODE_EX9E_SKIP_IF_PRESSED.toString(): {
            this.executeOpcode_EX9E_skipIfPressed(opcode);
            break;
        }
        case Opcodes.OPCODE_EXA1_SKIP_IF_NOT_PRESSED.toString(): {
            this.executeOpcode_EXA1_skipIfNotPressed(opcode);
            break;
        }
        case Opcodes.OPCODE_FX07_STORE_DELAY_TIMER_TO_VX.toString(): {
            this.executeOpcode_FX07_storeDelayTimerToVX(opcode);
            break;
        }
        case Opcodes.OPCODE_FX15_STORE_VX_TO_DELAY_TIMER.toString(): {
            this.executeOpcode_FX15_storeVXToDelayTimer(opcode);
            break;
        }
        case Opcodes.OPCODE_FX18_STORE_VX_TO_SOUND_TIMER.toString(): {
            this.executeOpcode_FX18_storeVXToSoundTimer(opcode);
            break;
        }
        case Opcodes.OPCODE_FX1E_ADD_VX_TO_I.toString(): {
            this.executeOpcode_FX1E_addVXToI(opcode);
            break;
        }
        case Opcodes.OPCODE_CXNN_STORE_RANDOM_NUMBER_TO_VX.toString(): {
            this.executeOpcode_CXNN_storeRandomNumberToVX(opcode);
            break;
        }
        case Opcodes.OPCODE_DXYN_DRAW_VX_VY.toString(): {
            this.executeOpcode_DXYN_drawVxVy(opcode);
            break;
        }
        case Opcodes.OPCODE_FX0A_START_WAIT_FOR_STORE_KEYPRESS_TO_VX.toString(): {
            this.executeOpcode_FX0A_startWaitForStoreKeypressToVX(opcode);
            break;
        }
        case Opcodes.OPCODE_8XY4_ADD_WITH_CARRY.toString(): {
            this.executeOpcode_8XY4_addWithCarry(opcode);
            break;
        }
        case Opcodes.OPCODE_FX33_STORE_DECIMAL_VALUE_TO_VX.toString(): {
            this.executeOpcode_FX33_storeDecimalValueToVX(opcode);
            break;
        }
        case Opcodes.OPCODE_FX55_STORE_FROM_V0_VX_TO_MEMORY.toString(): {
            this.executeOpcode_FX55_storeFromV0VXToMemory(opcode);
            break;
        }
        case Opcodes.OPCODE_FX65_STORE_FROM_MEMORY_TO_V0_VX.toString(): {
            this.executeOpcode_FX65_storeFromMemoryToV0VX(opcode);
            break;
        }
        case Opcodes.OPCODE_8XYE_SHIFT_LEFT_VX_VY.toString(): {
            this.executeOpcode_8XYE_shiftLeftVXVY(opcode);
            break;
        }
        case Opcodes.OPCODE_9XY0_SKIP_IF_VX_NOT_EQUAL_VY.toString(): {
            this.executeOpcode_9XY0_skipIfVXDoesNotEqualVY(opcode);
            break;
        }
        case Opcodes.OPCODE_FX29_SET_I_TO_VX_SPRITE_LOCATION.toString(): {
            this.executeOpcode_FX29_setIToVxSpriteLocation(opcode);
            break;
        }
        default: {
            throw new Error('Error: cpu found unknown opcode')
        }
        }
    }

    private executeOpcode_00E0_clearDisplay(): void {
        this.display.clearDisplay();
        this.programCounter += 2;
    }

    private executeOpcode_8XY2_setVXToBitwiseAndVY(opcode: number): void {
        console.log('call executeOpcode_8XY2_setVXToBitwiseAndVY ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] & this.registers[vY];
        this.programCounter += 2;
    }

    private executeOpcode_8XY1_setVXToBitwiseOrVY(opcode: number): void {
        console.log('call executeOpcode_8XY1_setVXToBitwiseOrVY ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] | this.registers[vY];
        this.programCounter += 2;
    }

    private executeOpcode_8XY3_setVXToBitwiseXorVY(opcode: number): void {
        console.log('call executeOpcode_8XY3_setVXToBitwiseXorVY ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vX] ^ this.registers[vY];
        this.programCounter += 2;
    }

    private executeOpcode_8XY0_setVXToVY(opcode: number): void {
        console.log('call executeOpcode_8XY0_setVXToVY ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        this.registers[vX] = this.registers[vY];
        this.programCounter += 2;
    }

    private executeOpcode_8XY5_subtractVYFromVXWithCarry(opcode: number): void {
        console.log('call executeOpcode_8XY5_subtractVYFromVXWithCarry ' + opcode.toString(16));
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

    private executeOpcode_8XY7_subtractVXFromVYWithCarry(opcode: number): void {
        console.log('call executeOpcode_8XY7_subtractVXFromVYWithCarry ' + opcode.toString(16));
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

    private executeOpcode_7XNN_addNNToVX(opcode: number): void {
        console.log('call executeOpcode_7XNN_addNNToVX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nn = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] += nn;
        this.programCounter += 2;
    }

    private executeOpcode_6XNN_setVXToNN(opcode: number): void {
        console.log('call executeOpcode_6XNN_setVXToNN ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        this.registers[vX] = nnAddress;
        this.programCounter += 2;
    }

    private executeOpcode_8XY6_shiftRightVxVy(opcode: number): void {
        console.log('call executeOpcode_8XY6_shiftRightVxVy ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        const leastSignificantBitOfVy = this.registers[vY] & 0x00F;
        this.registers[0xF] = leastSignificantBitOfVy;

        this.registers[vX] = this.registers[vY] >> 1;
        this.programCounter += 2;
    }

    private executeOpcode_5XY0_skipIfVXEqualsVY(opcode: number): void {
        console.log('call executeOpcode_5XY0_skipIfVXEqualsVY ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        if (this.registers[vX] === this.registers[vY]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private executeOpcode_4XNN_skipIfVXDoesNotEqualNN(opcode: number): void {
        console.log('call executeOpcode_4XNN_skipIfVXDoesNotEqualNN ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress !== this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private executeOpcode_3XNN_skipIfVXEqualsNN(opcode: number): void {
        console.log('call executeOpcode_3XNN_skipIfVXEqualsNN ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const nnAddress = OpcodeReader.parseOpcodeNN(opcode);

        if (nnAddress === this.registers[vX]) {
            this.programCounter += 4;
        }
        else {
            this.programCounter += 2;
        }
    }

    private executeOpcode_00EE_returnFromSubroutine(opcode: number): void {
        console.log('call executeOpcode_00EE_returnFromSubroutine ' + opcode.toString(16));

        console.log(`returnFromSubroutine PRE: this.stack is: ${this.stack}`)
        console.log(`returnFromSubroutine PRE: this.stackPointer is: ${this.stackPointer}`)
        console.log(`returnFromSubroutine PRE: this.programCounter is: ${this.programCounter}`)

        this.programCounter = this.stack[this.stackPointer];
        this.stackPointer -= 1;

        console.log(`returnFromSubroutine POST: this.stack is: ${this.stack}`)
        console.log(`returnFromSubroutine POST: this.stackPointer is: ${this.stackPointer}`)
        console.log(`returnFromSubroutine POST: this.programCounter is: ${this.programCounter}`)
    }

    private executeOpcode_1NNN_jumpToAddress(opcode: number): void {
        console.log('call executeOpcode_1NNN_jumpToAddress ' + opcode.toString(16));
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.programCounter = nnnAddress;
    }

    private executeOpcode_ANNN_loadIndexRegister(opcode: number): void {
        console.log('call executeOpcode_ANNN_loadIndexRegister ' + opcode.toString(16));
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        this.indexRegister = nnnAddress;
        this.programCounter += 2;
    }

    private executeOpcode_2NNN_jumpToSubroutine(opcode: number): void {
        console.log('call executeOpcode_2NNN_jumpToSubroutine ' + opcode.toString(16));
        this.stackPointer += 1;
        this.stack[this.stackPointer] = this.programCounter;
        this.programCounter = OpcodeReader.parseOpcodeNNN(opcode);
    }

    private executeOpcode_BNNN_jumpWithV0Offset(opcode: number): void {
        console.log('call executeOpcode_BNNN_jumpWithV0Offset ' + opcode.toString(16));
        const nnnAddress = OpcodeReader.parseOpcodeNNN(opcode);
        const v0Data = this.registers[0];
        this.programCounter = nnnAddress + v0Data;
    }

    private executeOpcode_EX9E_skipIfPressed(opcode: number): void {
        console.log('call executeOpcode_EX9E_skipIfPressed ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress === this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private executeOpcode_EXA1_skipIfNotPressed(opcode: number): void {
        console.log('call executeOpcode_EXA1_skipIfNotPressed ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        const sourceKeyPress = this.registers[vX];

        if (sourceKeyPress !== this.currentKeyPressed) {
            this.programCounter += 2;
        }
    }

    private executeOpcode_FX07_storeDelayTimerToVX(opcode: number): void {
        console.log('call executeOpcode_FX07_storeDelayTimerToVX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.registers[vX] = this.delayTimer;
        this.programCounter += 2;
    }

    private executeOpcode_FX15_storeVXToDelayTimer(opcode: number): void {
        console.log('call executeOpcode_FX15_storeVXToDelayTimer ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.delayTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private executeOpcode_FX18_storeVXToSoundTimer(opcode: number): void {
        console.log('call executeOpcode_FX18_storeVXToSoundTimer ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.soundTimer = this.registers[vX];
        this.programCounter += 2;
    }

    private executeOpcode_FX1E_addVXToI(opcode: number): void {
        console.log('call executeOpcode_FX1E_addVXToI ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.indexRegister += this.registers[vX];
        this.programCounter += 2
    }

    private executeOpcode_CXNN_storeRandomNumberToVX(opcode: number): void {
        console.log('call executeOpcode_CXNN_storeRandomNumberToVX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const sourceNumber = OpcodeReader.parseOpcodeNN(opcode);
        const randomNumber = RandomNumberGenerator.getRandomIntMax255();

        const adjustedNumber = sourceNumber & randomNumber;

        this.registers[vX] = adjustedNumber;
        this.programCounter += 2;
    }

    private executeOpcode_DXYN_drawVxVy(opcode: number): void {
        console.log('call drawDxDy ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);
        const height = OpcodeReader.parseOpcodeN(opcode);

        for (let yLine = 0; yLine < height; yLine++) {
            const pixel = this.memory[this.indexRegister + yLine];

            for (let xLine = 0; xLine < 8; xLine++) {

                const x = this.registers[vX] + xLine;
                const y = this.registers[vY] + yLine;
                const value = pixel & (1 << (7 - xLine)) ? 1: 0;

                if (this.display.drawPixel(x, y, value)) {
                    this.registers[0xF] = 1;
                }
            }
        }

        this.programCounter += 2;
    }

    private executeOpcode_FX0A_startWaitForStoreKeypressToVX(opcode: number): void {
        console.log('call executeOpcode_FX0A_startWaitForStoreKeypressToVX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        this.isHalted = true;
        this.hasPendingWaitForStoreKeypressToVX = true;
        this.pendingWaitForStoreKeypressToVXRegister = vX;
    }

    public finishWaitForStoreKeypressToVX(targetRegister: number) {
        console.log ('call finishWaitForStoreKeypressToVX' + targetRegister);
        this.registers[targetRegister] = this.currentKeyPressed;
        this.hasPendingWaitForStoreKeypressToVX = false;
        this.isHalted = false;
        this.programCounter += 2
    }

    private executeOpcode_8XY4_addWithCarry(opcode: number): void {
        console.log('call executeOpcode_8XY4_addWithCarry ' + opcode.toString(16));
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

    private executeOpcode_FX33_storeDecimalValueToVX(opcode: number): void {
        console.log('call executeOpcode_FX33_storeDecimalValueToVX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.memory[this.indexRegister] = Math.floor(this.registers[vX] / 100);
        this.memory[this.indexRegister + 1] = Math.floor((this.registers[vX] / 10) % 10);
        this.memory[this.indexRegister + 2] = Math.floor((this.registers[vX] % 100) % 10);

        this.programCounter += 2;
    }

    private executeOpcode_FX55_storeFromV0VXToMemory(opcode: number): void {
        console.log('call executeOpcode_FX55_storeFromV0VXToMemory ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.memory[counter + this.indexRegister] = this.registers[counter];
        }

        this.programCounter += 2;
    }

    private executeOpcode_FX65_storeFromMemoryToV0VX(opcode: number): void {
        console.log('call executeOpcode_FX65_storeFromMemoryToV0VX ' + opcode.toString(16));
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        for (let counter = 0; counter <= vX; counter++) {
            this.registers[counter] = this.memory[this.indexRegister + vX];
        }

        this.programCounter += 2;
    }

    private executeOpcode_8XYE_shiftLeftVXVY(opcode: number): void {
        console.log('call executeOpcode_8XYE_shiftLeftVXVY ' + opcode.toString(16));

        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        const mostSignificantBitOfVy = this.registers[vY] >> 8;
        this.registers[0xF] = mostSignificantBitOfVy;

        this.registers[vX] = this.registers[vY] << 1;

        this.programCounter += 2;
    }

    private executeOpcode_9XY0_skipIfVXDoesNotEqualVY(opcode: number): void {
        const vX = OpcodeReader.parseOpcodeVX(opcode);
        const vY = OpcodeReader.parseOpcodeVY(opcode);

        if (this.registers[vX] !== this.registers[vY]) {
            this.programCounter += 4;
        } else {
            this.programCounter += 2;
        }
    }

    private executeOpcode_FX29_setIToVxSpriteLocation(opcode: number): void {
        const vX = OpcodeReader.parseOpcodeVX(opcode);

        this.indexRegister = this.registers[vX] * 5;

        this.programCounter += 2;
    }
}
