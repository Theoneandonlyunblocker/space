export class RampingValue
{
  public base: number;
  public up: number;
  public down: number;

  public lastValue: number;

  constructor(base: number, up: number = 0, down: number = 0)
  {
    this.base = this.lastValue = base;
    this.up = up;
    this.down = down;
  }

  public getValue(up: number = 0, down: number = 0): number
  {
    const value = this.base + this.up * up + this.down * down;
    this.lastValue = value;

    return this.lastValue;
  }

  public clone(): RampingValue
  {
    return new RampingValue(this.base, this.up, this.down);
  }
}
