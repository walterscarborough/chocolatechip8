import {expect} from 'chai';
import RandomNumberGenerator from '../old-src/randomNumberGenerator';

describe('RandomNumberGenerator', () => {
    it('returns a random number between 0 and 255', () => {
        const randomNumber = RandomNumberGenerator.getRandomIntMax255();

        expect(randomNumber).greaterThan(-1);
        expect(randomNumber).lessThan(256);
    });
});