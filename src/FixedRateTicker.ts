/// <reference path="../lib/pixi.d.ts" />

export class FixedRateTicker
{
  public tickRate: number;

  private readonly ticker: PIXI.ticker.Ticker;
  private readonly onTick: (tickCount: number) => void;

  private accumulatedTime: number = 0;

  constructor(onTick: (tickCount: number) => void, tickRate: number)
  {
    this.tickRate = tickRate;
    this.onTick = onTick;

    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.add(this.onTickerUpdate, this);
  }

  public start(): void
  {
    this.accumulatedTime = 0;
    this.ticker.start();
  }
  public stop(): void
  {
    this.ticker.stop();
  }

  private onTickerUpdate(): void
  {
    this.accumulatedTime += this.ticker.elapsedMS;

    const ticksToPlay = Math.floor(this.accumulatedTime / this.tickRate);

    if (ticksToPlay)
    {
      this.accumulatedTime -= ticksToPlay * this.tickRate;
      this.onTick(ticksToPlay);
    }
  }
}
