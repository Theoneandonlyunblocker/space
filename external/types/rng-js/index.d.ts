declare class RNG
{
  constructor(seed: number | string | (() => number))

  public random(): number;
  public random(to: number): number;
  public random(from: number, to: number): number;
  public uniform(): number;
  public normal(): number;
  public exponential(): number;
  public poisson(mean?: number): number;
  public gamma(a: number): number;
}

declare namespace RNG
{
  export const roller: (diceRollExpression: string, rng?: RNG) => (() => number);
}

declare module "rng-js"
{
  export = RNG
}
