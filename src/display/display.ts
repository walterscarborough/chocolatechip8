export interface Display {
    initializeDisplay(): void;
    clearDisplay(): void;
    drawPixel(x: number, y: number, value: number): number;
}
