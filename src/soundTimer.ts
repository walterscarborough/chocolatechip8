// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as log from 'loglevel';

export default class SoundTimer {

    public static updateSoundTimer(soundTimer: number): number {
        if (soundTimer > 0) {

            if (soundTimer == 1) {
                log.debug('beep!');
            }

            soundTimer -= 1;
        }

        return soundTimer;
    }
}
