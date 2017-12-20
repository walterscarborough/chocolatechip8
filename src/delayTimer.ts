export default class DelayTimer {

    public static getUpdatedDelayTimer(delayTimer: number): number {
        if (delayTimer > 0) {
            delayTimer -= 1;
        }

        return delayTimer;
    }
}
