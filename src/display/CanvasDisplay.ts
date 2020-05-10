import {Display} from "./display";

const DISPLAY_WIDTH = 64;
const DISPLAY_HEIGHT = 32;
const EMPTY_FILL_COLOR = 'black';
const PIXEL_COLOR = 'yellow';

export default class CanvasDisplay implements Display{

    private frameBuffer: Array<Array<number>> = [];
    private screen = document.querySelector('canvas') as HTMLCanvasElement;
    private context = this.screen.getContext('2d') as CanvasRenderingContext2D;
    private screenSizeMultiplier = 15;

    constructor() {
        this.screen.width = DISPLAY_WIDTH * this.screenSizeMultiplier;
        this.screen.height = DISPLAY_HEIGHT * this.screenSizeMultiplier;
        this.context.fillStyle = EMPTY_FILL_COLOR;
        this.context.fillRect(0, 0, this.screen?.width, this.screen?.height);
    }

    clearDisplay(): void {
        this.initializeDisplay();
        this.context.fillStyle = EMPTY_FILL_COLOR
        this.context.fillRect(
            0,
            0,
            this.screen.width,
            this.screen.height
        )
    }

    drawPixel(x: number, y: number, value: number): number {
        this.frameBuffer[y][x] ^= value

        if (this.frameBuffer[y][x]) {
            this.context.fillStyle = PIXEL_COLOR;
            this.context.fillRect(
                x * this.screenSizeMultiplier,
                y * this.screenSizeMultiplier,
                this.screenSizeMultiplier,
                this.screenSizeMultiplier
            )
        } else {
            this.context.fillStyle = EMPTY_FILL_COLOR;
            this.context.fillRect(
                x * this.screenSizeMultiplier,
                y * this.screenSizeMultiplier,
                this.screenSizeMultiplier,
                this.screenSizeMultiplier
            )
        }

        const collision = (this.frameBuffer[y][x] & value);
        return collision
    }

    initializeDisplay(): void {
        const newFrameBuffer: Array<Array<number>> = [];

        for (let i = 0; i < DISPLAY_WIDTH; i++) {
            newFrameBuffer.push([]);

            for (let j = 0; j < DISPLAY_HEIGHT; j++) {
                newFrameBuffer[i].push(0);
            }
        }

        this.frameBuffer = newFrameBuffer;
    }
}
