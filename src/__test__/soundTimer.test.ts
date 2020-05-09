import SoundTimer from '../soundTimer';

describe('SoundTimer', () => {
    it('returns a decremented value if greater than 0', () => {
        const soundTimer = 10;
        const expectedSoundTimer = 9;


        expect(SoundTimer.updateSoundTimer(soundTimer)).toEqual(expectedSoundTimer);
    });

    it('returns the same input value if less than 0', () => {
        const soundTimer = 0;
        const expectedSoundTimer = 0;


        expect(SoundTimer.updateSoundTimer(soundTimer)).toEqual(expectedSoundTimer);
    });
});
