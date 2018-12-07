package com.walterscarborough.chocolatechip8.interpreter.stubs

import com.walterscarborough.chocolatechip8.interpreter.RandomNumberGenerator

class RandomNumberGeneratorStub : RandomNumberGenerator {
    var randomNumber = 0

    override fun getRandomInt(): Int {
        return randomNumber
    }
}