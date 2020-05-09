import RandomNumberGenerator from '../randomNumberGenerator';

describe('RandomNumberGenerator', () => {
    it('returns a random number between 0 and 255', () => {
        const randomNumber = RandomNumberGenerator.getRandomIntMax255();

        expect(randomNumber).toBeGreaterThan(-1);
        expect(randomNumber).toBeLessThan(256);
    });
});
