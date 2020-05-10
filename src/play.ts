import CanvasDisplay from "./display/CanvasDisplay";
import Cpu from "./cpu";

function readRomFile(romFileTarget: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();

        reader.onload = (): void => {
            const text = reader.result as ArrayBuffer;
            resolve(text);
        };

        reader.readAsArrayBuffer(romFileTarget);
    });
}

function playGame(gameData: Uint8Array): void {
    const canvasDisplay = new CanvasDisplay();
    const cpu = new Cpu(canvasDisplay);

    cpu.loadGame(gameData);
}

document.addEventListener('DOMContentLoaded', () => {
    const romElement = document.getElementById('romFile') as HTMLInputElement;

    romElement.addEventListener('change', () => {
        const file = romElement?.files![0];
        console.log(
            'Loading: ' + file.name
        );

        readRomFile(file)
            .then((text) => {
                const gameData = new Uint8Array(text);
                playGame(gameData);
            });
    });
});
