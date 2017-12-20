import {expect} from 'chai';
import DelayTimer from '../src/delayTimer';

describe('DelayTimer', () => {

    describe('delay timer handling', () => {

        it('returns a decremented value if greater than 0', () => {
            const delayTimer = 10;
            const expectedDelayTimer = 9;


            expect(DelayTimer.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });

        it('returns the same input value if less than 0', () => {
            const delayTimer = 0;
            const expectedDelayTimer = 0;


            expect(DelayTimer.getUpdatedDelayTimer(delayTimer)).equal(expectedDelayTimer);
        });
    });
});
