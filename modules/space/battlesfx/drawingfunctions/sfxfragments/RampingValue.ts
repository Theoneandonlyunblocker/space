export default class RampingValue
{
  public base: number;
  public up: number;
  public down: number;

  constructor(base: number, up: number = 0, down: number = 0)
  {
    this.base = base;
    this.up = up;
    this.down = down;
  }

  public getValue(up: number = 0, down: number = 0): number
  {
    return this.base + this.up * up + this.down * down;
  }

  public clone(): RampingValue
  {
    return new RampingValue(this.base, this.up, this.down);
  }
}
