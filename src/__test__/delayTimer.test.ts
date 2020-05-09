import DelayTimer from '../delayTimer';

describe('DelayTimer', () => {
    it('returns a decremented value if greater than 0', () => {
        const delayTimer = 10;
        const expectedDelayTimer = 9;


        expect(DelayTimer.updateDelayTimer(delayTimer)).toEqual(expectedDelayTimer);
    });

    it('returns the same input value if less than 0', () => {
        const delayTimer = 0;
        const expectedDelayTimer = 0;


        expect(DelayTimer.updateDelayTimer(delayTimer)).toEqual(expectedDelayTimer);
    });
});
