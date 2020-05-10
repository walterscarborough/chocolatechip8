import {Display} from "../../display/display";

export class StubDisplay implements Display {
  clearDisplay_callCount = 0;

  public clearDisplay(): void {
      this.clearDisplay_callCount += 1;
  }

  drawPixel_calledWith_x: number[] = [];
  drawPixel_calledWith_y: number[] = [];
  drawPixel_calledWith_value: number[] = [];
  drawPixel_callCount = 0;
  drawPixel_return = 0;
  drawPixel(x: number, y: number, value: number): number {
      this.drawPixel_callCount += 1;

      this.drawPixel_calledWith_x.push(x);
      this.drawPixel_calledWith_y.push(y);
      this.drawPixel_calledWith_value.push(value);

      return this.drawPixel_return;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeDisplay(): void {}
}
