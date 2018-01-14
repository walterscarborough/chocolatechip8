package com.walterscarborough.chocolatechip8.stubs

import com.walterscarborough.chocolatechip8.RandomNumberGenerator

class RandomNumberGeneratorStub: RandomNumberGenerator {
    var randomNumber = 0

    override fun getRandomInt(): Int {
        return randomNumber
    }
}