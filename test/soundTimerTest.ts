import {expect} from 'chai';
import SoundTimer from '../src/soundTimer';

describe('SoundTimer', () => {
    it('returns a decremented value if greater than 0', () => {
        const soundTimer = 10;
        const expectedSoundTimer = 9;


        expect(SoundTimer.updateSoundTimer(soundTimer)).equal(expectedSoundTimer);
    });

    it('returns the same input value if less than 0', () => {
        const soundTimer = 0;
        const expectedSoundTimer = 0;


        expect(SoundTimer.updateSoundTimer(soundTimer)).equal(expectedSoundTimer);
    });
});