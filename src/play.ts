import Cpu from '../src/cpu';
import {debuglog, log} from 'util';

async function readRomFile(romFileTarget) {

    const promise = new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as ArrayBuffer;
            resolve(text);
        };

        reader.readAsArrayBuffer(romFileTarget);
    });

    return promise;
}

function playGame(gameData) {
    const cpu = new Cpu();

    cpu.loadGame(gameData);
}

document.addEventListener('DOMContentLoaded', () => {
    const romElement = (<HTMLInputElement>document.getElementById('romFile'));

    romElement.addEventListener('change', () => {
        log(
            'Loading: ' + romElement.files[0].name
        );

        readRomFile(romElement.files[0])
            .then((text) => {
                const gameData = new Uint8Array(text);
                playGame(gameData);
            });
    });
});
