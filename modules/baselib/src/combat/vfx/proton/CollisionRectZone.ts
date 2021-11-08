import * as Proton from "proton-js";

import { PixiParticle } from "./PixiParticle";


export class CollisionRectZone<P extends Proton.Particle = PixiParticle> extends Proton.RectZone<P>
{
  constructor(x: number, y: number, width: number, height: number)
  {
    super(x, y, width, height);
  }

  public override crossing(particle: P): void
  {
    const xIsWithin = particle.p.x + particle.radius > this.x &&
      particle.p.x - particle.radius < this.x + this.width;
    const particleIsWithin = xIsWithin &&
      particle.p.y + particle.radius > this.y &&
      particle.p.y - particle.radius < this.y + this.height;

    switch (this.crossType)
    {
      case "dead":
      {
        if (particleIsWithin)
        {
          particle.dead = true;
        }
      }
    }
  }
}
