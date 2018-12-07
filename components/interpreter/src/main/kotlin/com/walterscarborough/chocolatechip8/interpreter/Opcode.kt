package com.walterscarborough.chocolatechip8.interpreter

interface Opcode {
    val value: Int
}

data class Opcode_RETURN_FROM_SUBROUTINE(override val value: Int) : Opcode
data class Opcode_JUMP_TO_ADDRESS(override val value: Int) : Opcode
data class Opcode_JUMP_TO_SUBROUTINE(override val value: Int) : Opcode
data class Opcode_SKIP_IF_VX_EQUALS_NN(override val value: Int) : Opcode
data class Opcode_SKIP_IF_VX_DOES_NOT_EQUAL_NN(override val value: Int) : Opcode
data class Opcode_SKIP_IF_VX_EQUALS_VY(override val value: Int) : Opcode
data class Opcode_SET_VX_TO_NN(override val value: Int) : Opcode
data class Opcode_ADD_NN_TO_VX(override val value: Int) : Opcode
data class Opcode_SET_VX_TO_VY(override val value: Int) : Opcode
data class Opcode_SET_VX_TO_BITWISE_OR_VY(override val value: Int) : Opcode
data class Opcode_SET_VX_TO_BITWISE_AND_VY(override val value: Int) : Opcode
data class Opcode_SET_VX_TO_BITWISE_X_OR_VY(override val value: Int) : Opcode
data class Opcode_ADD_WITH_CARRY(override val value: Int) : Opcode
data class Opcode_SUBTRACT_VY_FROM_VX_WITH_CARRY(override val value: Int) : Opcode
data class Opcode_SHIFT_VX_RIGHT(override val value: Int) : Opcode
data class Opcode_SUBTRACT_VX_FROM_VY_WITH_CARRY(override val value: Int) : Opcode
data class Opcode_LOAD_INDEX_REGISTER(override val value: Int) : Opcode
data class Opcode_JUMP_WITH_V0_OFFSET(override val value: Int) : Opcode
data class Opcode_STORE_RANDOM_NUMBER_TO_VX(override val value: Int) : Opcode
data class Opcode_DRAW_VX_VY(override val value: Int) : Opcode
data class Opcode_SKIP_IF_PRESSED(override val value: Int) : Opcode
data class Opcode_SKIP_IF_NOT_PRESSED(override val value: Int) : Opcode
data class Opcode_STORE_DELAY_TIMER_TO_VX(override val value: Int) : Opcode
data class Opcode_START_WAIT_FOR_STORE_KEYPRESS_TO_VX(override val value: Int) : Opcode
data class Opcode_STORE_VX_TO_DELAY_TIMER(override val value: Int) : Opcode
data class Opcode_STORE_VX_TO_SOUND_TIMER(override val value: Int) : Opcode
data class Opcode_ADD_VX_TO_I(override val value: Int) : Opcode
data class Opcode_STORE_DECIMAL_VALUE_TO_VX(override val value: Int) : Opcode
data class Opcode_STORE_FROM_V0_VX_TO_MEMORY(override val value: Int) : Opcode
data class Opcode_STORE_FROM_MEMORY_TO_V0_VX(override val value: Int) : Opcode