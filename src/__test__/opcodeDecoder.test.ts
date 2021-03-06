import OpcodeDecoder from "../opcodeDecoder";
import {Opcodes} from "../opcodes";

describe('opcodes', () => {

    it.skip('decodes opcode 0x0NNN (executeSubroutineNNN)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x0000);

        expect(decodedOpcode).toEqual(Opcodes.EXECUTE_SUBROUTINE_NNN);
    });

    it('decodes opcode 0x00E0 (clearDisplay)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x00E0);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_00E0_CLEAR_DISPLAY);
    });

    it('decodes opcode 0x00EE (returnFromSubroutine)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x00EE);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_00EE_RETURN_FROM_SUBROUTINE);
    });

    it('decodes opcode 0x1NNN (jumpToAddress)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x100A);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_1NNN_JUMP_TO_ADDRESS);
    });

    it('decodes opcode 0x2NNN (jumpToSubroutine)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x20F0);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_2NNN_JUMP_TO_SUBROUTINE);
    });

    it('decodes opcode 0x3XNN (skipIfVXEqualsNN)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x3003);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_3XNN_SKIP_IF_VX_EQUALS_NN);
    });

    it('decodes opcode 0x4XNN (skipIfVXDoesNotEqualNN)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x4003);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_4XNN_SKIP_IF_VX_DOES_NOT_EQUAL_NN);
    });

    it('decodes opcode 0x5XY0 (skipIfVXEqualsVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x5010);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_5XY0_SKIP_IF_VX_EQUALS_VY);
    });

    it('decodes opcode 0x6XNN (setVXToNN)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x6006);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_6XNN_SET_VX_TO_NN);
    });

    it('decodes opcode 0x7XNN (addNNToVX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x7006);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_7XNN_ADD_NN_TO_VX);
    });

    it('decodes opcode 0x8XY0 (setVXToVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8010);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY0_SET_VX_TO_VY);
    });

    it('decodes opcode 0x8XY1 (setVXToBitwiseOrVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8011);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY1_SET_VX_TO_BITWISE_OR_VY);
    });

    it('decodes opcode 0x8XY2 (setVXToBitwiseAndVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8012);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY2_SET_VX_TO_BITWISE_AND_VY);
    });

    it('decodes opcode 0x8XY3 (setVXToBitwiseXorVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8013);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY3_SET_VX_TO_BITWISE_X_OR_VY);
    });

    it('decodes opcode 0x8XY4 (addWithCarry)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8234);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY4_ADD_WITH_CARRY);
    });

    it('decodes opcode 0x8XY5 (subtractVYFromVXWithCarry)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8015);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY5_SUBTRACT_VY_FROM_VX_WITH_CARRY);
    });

    it('decodes opcode 0x8XY6 (shiftRightVxVy)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8006);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY6_SHIFT_RIGHT_VX_VY);
    });

    it('decodes opcode 0x8XY7 (subtractVXFromVYWithCarry)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x8017);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XY7_SUBTRACT_VX_FROM_VY_WITH_CARRY);
    });

    it('decodes opcode 0x8XYE (shiftLeftVxVy)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x800E);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_8XYE_SHIFT_LEFT_VX_VY);
    });

    it('decodes opcode 0x9XY0 (skipIfVXNotEqualVY)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0x9000);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_9XY0_SKIP_IF_VX_NOT_EQUAL_VY);
    });

    it('decodes opcode 0xANNN (loadIndexRegister)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xA2F0);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_ANNN_LOAD_INDEX_REGISTER);
    });

    it('decodes opcode 0xBNNN (jumpWithV0Offset)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xB002);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_BNNN_JUMP_WITH_V0_OFFSET);
    });

    it('decodes opcode 0xCXNN (storeRandomNumberToVX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xC0A4);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_CXNN_STORE_RANDOM_NUMBER_TO_VX);
    });

    it('decodes opcode 0xDXYN (drawVxVy)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xD003);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_DXYN_DRAW_VX_VY);
    });

    it('decodes opcode 0xEX9E (skipIfPressed)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xE09E);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_EX9E_SKIP_IF_PRESSED);
    });

    it('decodes opcode 0xEXA1 (skipIfNotPressed)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xE0A1);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_EXA1_SKIP_IF_NOT_PRESSED);
    });

    it('decodes opcode 0xFX07 (storeDelayTimerToVX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF007);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX07_STORE_DELAY_TIMER_TO_VX);
    });

    it('decodes opcode 0xFX0A (waitForStoreKeypressToVX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF00A);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX0A_START_WAIT_FOR_STORE_KEYPRESS_TO_VX);
    });

    it('decodes opcode 0xFX15 (storeVXToDelayTimer)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF015);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX15_STORE_VX_TO_DELAY_TIMER);
    });

    it('decodes opcode 0xFX18 (storeVXToSoundTimer)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF018);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX18_STORE_VX_TO_SOUND_TIMER);
    });

    it('decodes opcode 0xFX1E (addVXToI)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF01E);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX1E_ADD_VX_TO_I);
    });

    it('decodes opcode 0xFX29 (setIToVXSpriteLocation)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF029);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX29_SET_I_TO_VX_SPRITE_LOCATION);
    });

    it('decodes opcode 0xFX33 (storeDecimalValueToVX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xF333);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX33_STORE_DECIMAL_VALUE_TO_VX);
    });

    it('decodes opcode 0xFX55 (storeFromV0VXToMemory)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xFF55);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX55_STORE_FROM_V0_VX_TO_MEMORY);
    });

    it('decodes opcode 0xFX65 (storeFromMemoryToV0VX)', () => {
        const decodedOpcode = OpcodeDecoder.decodeOpcode(0xFF65);

        expect(decodedOpcode).toEqual(Opcodes.OPCODE_FX65_STORE_FROM_MEMORY_TO_V0_VX);
    });
});
