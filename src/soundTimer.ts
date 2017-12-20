export default class SoundTimer {

    public static updateSoundTimer(soundTimer: number): number {
        if (soundTimer > 0) {

            if (soundTimer == 1) {
                console.log('beep!');
            }

            soundTimer -= 1;
        }

        return soundTimer;
    }
}
