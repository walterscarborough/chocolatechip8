import OpcodeReader from "./opcodeReader";
import {Opcodes} from "./opcodes";

export default class OpcodeDecoder {

  public static decodeOpcode = (opcode: number): Opcodes => {

      // We only care about the first letter in the opcode for switching purposes
      switch (OpcodeReader.parseOpcodeFirstMask(opcode)) {

      case 0x0000: {
          switch (OpcodeReader.parseOpcodeNN(opcode)) {

          case 0x00EE: {
              return Opcodes.RETURN_FROM_SUBROUTINE
          }

          case 0x00E0: {
              return Opcodes.CLEAR_DISPLAY;
          }

          default: {
              throw new Error(`opcode "${opcode.toString(16)}" not implemented!`)
          }
          }
      }

      case 0x1000: {
          return Opcodes.JUMP_TO_ADDRESS
      }

      case 0x2000: {
          return Opcodes.JUMP_TO_SUBROUTINE;
      }

      case 0x3000: {
          return Opcodes.SKIP_IF_VX_EQUALS_NN;
      }

      case 0x4000: {
          return Opcodes.SKIP_IF_VX_DOES_NOT_EQUAL_NN;
      }

      case 0x5000: {
          return Opcodes.SKIP_IF_VX_EQUALS_VY;
      }

      case 0x6000: {
          return Opcodes.SET_VX_TO_NN;
      }

      case 0x7000: {
          return Opcodes.ADD_NN_TO_VX;
      }

      case 0x8000: {
          switch (OpcodeReader.parseOpcodeN(opcode)) {

          case 0x0000: {
              return Opcodes.SET_VX_TO_VY;
          }

          case 0x0001: {
              return Opcodes.SET_VX_TO_BITWISE_OR_VY;
          }

          case 0x0002: {
              return Opcodes.SET_VX_TO_BITWISE_AND_VY;
          }

          case 0x0003: {
              return Opcodes.SET_VX_TO_BITWISE_X_OR_VY;
          }

          case 0x0004: {
              return Opcodes.ADD_WITH_CARRY;
          }

          case 0x0005: {
              return Opcodes.SUBTRACT_VY_FROM_VX_WITH_CARRY;
          }

          case 0x0006: {
              return Opcodes.SHIFT_RIGHT_VX_VY;
          }

          case 0x0007: {
              return Opcodes.SUBTRACT_VX_FROM_VY_WITH_CARRY;
          }

          case 0x000E: {
              return Opcodes.SHIFT_LEFT_VX_VY
          }

          default: {
              throw new Error(`opcode "${opcode.toString(16)}" not implemented!`);
          }
          }
      }

      case 0x9000: {
          return Opcodes.SKIP_IF_VX_NOT_EQUAL_VY
      }

      case 0xA000: {
          return Opcodes.LOAD_INDEX_REGISTER;
      }

      case 0xB000: {
          return Opcodes.JUMP_WITH_V0_OFFSET;
      }

      case 0xC000: {
          return Opcodes.STORE_RANDOM_NUMBER_TO_VX;
      }

      case 0xD000: {
          return Opcodes.DRAW_VX_VY;
      }

      case 0xE000: {
          switch (OpcodeReader.parseOpcodeNN(opcode)) {

          case 0x009E: {
              return Opcodes.SKIP_IF_PRESSED;
          }

          case 0x00A1: {
              return Opcodes.SKIP_IF_NOT_PRESSED;
          }

          default: {
              throw new Error(`opcode "${opcode.toString(16)}" not implemented!`);
          }
          }
      }

      case 0xF000: {
          switch (OpcodeReader.parseOpcodeNN(opcode)) {

          case 0x0007: {
              return Opcodes.STORE_DELAY_TIMER_TO_VX;
          }

          case 0x000A: {
              return Opcodes.START_WAIT_FOR_STORE_KEYPRESS_TO_VX;
          }

          case 0x0015: {
              return Opcodes.STORE_VX_TO_DELAY_TIMER;
          }

          case 0x0018: {
              return Opcodes.STORE_VX_TO_SOUND_TIMER;
          }

          case 0x001E: {
              return Opcodes.ADD_VX_TO_I;
          }

          case 0x0033: {
              return Opcodes.STORE_DECIMAL_VALUE_TO_VX;
          }

          case 0x0055: {
              return Opcodes.STORE_FROM_V0_VX_TO_MEMORY;
          }

          case 0x0065: {
              return Opcodes.STORE_FROM_MEMORY_TO_V0_VX;
          }

          case 0x0029: {
              return Opcodes.SET_I_TO_VX_SPRITE_LOCATION;
          }

          default: {
              throw new Error(`opcode "${opcode.toString(16)}" not implemented!`);
          }
          }
      }

      default: {
          throw new Error(`opcode "${opcode.toString(16)}" not implemented!`);
      }
      }
  }
}
