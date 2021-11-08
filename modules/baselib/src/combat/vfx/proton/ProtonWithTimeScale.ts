import * as Proton from "proton-js";


export class ProtonWithTimeScale extends Proton
{
  public timeScale: number;

  constructor(timeScale: number = 1)
  {
    super();

    this.timeScale = timeScale;
  }

  public override update(): void
  {
    this.dispatchEvent(Proton.PROTON_UPDATE);

    const time = performance.now() / 1000;
    if (!this.oldTime)
    {
      this.oldTime = time;
    }

    this.elapsed = (time - this.oldTime) * this.timeScale;

    this.oldTime = time;

    if (this.elapsed > 0)
    {
      this.emittersUpdate(this.elapsed);
    }

    this.dispatchEvent(Proton.PROTON_UPDATE_AFTER);
  }
}
