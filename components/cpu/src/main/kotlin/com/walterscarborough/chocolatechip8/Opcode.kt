package com.walterscarborough.chocolatechip8

interface Opcode {}

class Opcode_RETURN_FROM_SUBROUTINE: Opcode {}
class Opcode_JUMP_TO_ADDRESS: Opcode {}
class Opcode_JUMP_TO_SUBROUTINE: Opcode {}
class Opcode_SKIP_IF_VX_EQUALS_NN: Opcode {}
class Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN: Opcode {}
class Opcode_SKIP_IF_VX_EQUALS_VY: Opcode {}
class Opcode_SET_VX_TO_NN: Opcode {}
class Opcode_ADD_NN_TO_VX: Opcode {}
class Opcode_SET_VX_TO_VY: Opcode {}
class Opcode_SET_VX_TO_BITWISE_OR_VY: Opcode {}
class Opcode_SET_VX_TO_BITWISE_AND_VY: Opcode {}
class Opcode_SET_VX_TO_BITWISE_X_OR_VY: Opcode {}
class Opcode_ADD_WITH_CARRY: Opcode {}
class Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY: Opcode {}
class Opcode_SHIFT_VX_RIGHT: Opcode {}
class Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY: Opcode {}
class Opcode_LOAD_INDEX_REGISTER: Opcode {}
class Opcode_JUMP_WITH_V0_OFFSET: Opcode {}
class Opcode_STORE_RANDOM_NUMBER_TO_VX: Opcode {}
class Opcode_DRAW_VX_VY: Opcode {}
class Opcode_SKIP_IF_PRESSED: Opcode {}
class Opcode_SKIP_IF_NOT_PRESSED: Opcode {}
class Opcode_STORE_DELAY_TIMER_TO_VX: Opcode {}
class Opcode_START_WAIT_FOR_STORE_KEYPRESS_TO_VX: Opcode {}
class Opcode_STORE_VX_TO_DELAY_TIMER: Opcode {}
class Opcode_STORE_VX_TO_SOUND_TIMER: Opcode {}
class Opcode_ADD_VX_TO_I: Opcode {}
class Opcode_STORE_DECIMAL_VALUE_TO_VX: Opcode {}
class Opcode_STORE_FROM_V0_VX_TO_MEMORY: Opcode {}
class Opcode_STORE_FROM_MEMORY_TO_V0_VX: Opcode {}