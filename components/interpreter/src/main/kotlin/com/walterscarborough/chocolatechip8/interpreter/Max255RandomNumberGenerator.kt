package com.walterscarborough.chocolatechip8.interpreter

import kotlin.math.floor

/**
 * Based on work from Valentin Michalak: https://gist.github.com/vmichalak/11e5ddb567786af0ed1ae4d7f57441d4
 */
class Max255RandomNumberGenerator(private var seed: Long = 0) : RandomNumberGenerator {

    companion object {
        private val mask: Long = (1L shl 48) - 1
        private val multiplier: Long = 25214903917
        private val increment: Long = 11
    }

    private fun next(bitCount: Int): Int {
        seed = (multiplier * seed + increment) and mask
        return seed.ushr(48 - bitCount).toInt()
    }

    private fun nextDouble(): Double {
        return ((next(26).toLong() shl 27) + next(27)) / (1L shl 53).toDouble()
    }

    override fun getRandomInt(): Int {
        val range = IntRange(0, 255)
        return floor(nextDouble() * (1 + range.last - range.first)).toInt() + range.first
    }
}