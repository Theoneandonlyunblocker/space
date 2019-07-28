import * as PIXI from "pixi.js";
import * as Proton from "proton-js";


export class PixiParticle extends Proton.Particle
{
  public displayObject: PIXI.DisplayObject;

  constructor()
  {
    super();
  }
}
