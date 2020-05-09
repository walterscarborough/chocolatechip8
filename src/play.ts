import Cpu from '../src/cpu';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as log from 'loglevel';

function readRomFile(romFileTarget): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();

        reader.onload = (): void => {
            const text = reader.result as ArrayBuffer;
            resolve(text);
        };

        reader.readAsArrayBuffer(romFileTarget);
    });
}

function playGame(gameData): void {
    const cpu = new Cpu();

    cpu.loadGame(gameData);
}

document.addEventListener('DOMContentLoaded', () => {
    const romElement = document.getElementById('romFile') as HTMLInputElement;

    romElement.addEventListener('change', () => {
        log.debug(
            'Loading: ' + romElement.files[0].name
        );

        readRomFile(romElement.files[0])
            .then((text) => {
                const gameData = new Uint8Array(text);
                playGame(gameData);
            });
    });
});
