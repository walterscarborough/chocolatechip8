import {Display} from "../../display/display";

export class StubDisplay implements Display {
  clearDisplayCallCount = 0;

  public clearDisplay(): void {
      this.clearDisplayCallCount += 1;
  }

}
