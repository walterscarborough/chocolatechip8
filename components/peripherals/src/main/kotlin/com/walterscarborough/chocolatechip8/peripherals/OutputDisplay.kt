package com.walterscarborough.chocolatechip8.peripherals

import com.walterscarborough.chocolatechip8.domain.Display

class OutputDisplay(
    override var graphicsData: IntArray = IntArray(4096)
) : Display