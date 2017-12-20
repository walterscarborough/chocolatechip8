import Cpu from '../src/cpu';

async function readRomFile(romFileTarget) {

    const promise = new Promise<String>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = reader.result;
            resolve(text);
        };

        reader.readAsText(romFileTarget); 
    });

    return promise;
};

document.addEventListener('DOMContentLoaded', () => {
    const romElement = document.getElementById('romFile');

    romElement.addEventListener('change', readRomFile);
});