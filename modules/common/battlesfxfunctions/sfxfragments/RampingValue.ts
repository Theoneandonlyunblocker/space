export default class RampingValue
{
  public base: number;
  public up: number | undefined;
  public down: number | undefined;

  constructor(base: number, up?: number, down?: number)
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
