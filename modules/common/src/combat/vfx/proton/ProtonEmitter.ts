import * as Proton from "proton-js";
import { PixiParticle } from "./PixiParticle";

// because the built in one does some dumb stuff
export class ProtonEmitter<P extends Proton.Particle = PixiParticle> extends Proton.Emitter<P>
{
  constructor()
  {
    super();
  }

  public update(time: number)
  {
    if (this.dead)
    {
      return
    }

    this.age += time;
    if (this.age >= this.life)
    {
      this.stop();
    }

    this.emitting(time);
    this.integrate(time);
  }
}
