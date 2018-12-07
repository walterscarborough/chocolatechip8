package com.walterscarborough.chocolatechip8.interpreter.stubs

import com.walterscarborough.chocolatechip8.domain.Display

class SpyDisplay(
    override var graphicsData: IntArray = IntArray(4096)
) : Display