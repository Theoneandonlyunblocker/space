import * as Proton from "proton-js";
import { PixiParticle } from "./PixiParticle";
import { Point } from "../../../../../src/Point";
import { getAngleBetweenPoints } from "../../../../../src/utility";


export class PolarVelocityInitialize<P extends Proton.Particle = PixiParticle> extends Proton.Initialize
{
  private readonly velocity: number;
  private readonly center: Point;

  constructor(velocity: number, center: Point = {x: 0, y: 0})
  {
    super();

    this.velocity = velocity;
    this.center = center;
  }

  public initialize(particle: P): void
  {
    const angle = getAngleBetweenPoints(particle.p, this.center) + 90 * Math.PI / 180;

    particle.v.x = this.velocity * Math.sin(angle);
    particle.v.y = this.velocity * -Math.cos(angle);
  }
}
