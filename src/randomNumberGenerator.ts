export default class RandomNumberGenerator {
    public static getRandomIntMax255(): number {
        const max = 255;
        const min = 0;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}