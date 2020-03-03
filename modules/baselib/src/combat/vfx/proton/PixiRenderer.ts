import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import {PixiParticle} from "./PixiParticle";


export class PixiRenderer extends Proton.CustomRenderer<PIXI.Container, PixiParticle, null>
{
  constructor(container: PIXI.Container)
  {
    super(container);
  }

  protected onProtonUpdate(): void
  {

  }
  protected onProtonUpdateAfter(): void
  {

  }
  protected onEmitterAdded(emitter: Proton.Emitter<PixiParticle>): void
  {

  }
  protected onEmitterRemoved(emitter: Proton.Emitter<PixiParticle>): void
  {

  }
  protected onParticleCreated(particle: PixiParticle): void
  {
    this.element.addChild(particle.displayObject);
  }
  protected onParticleUpdate(particle: PixiParticle): void
  {
    PixiRenderer.applyTransform(particle);
  }
  protected onParticleDead(particle: PixiParticle): void
  {
    this.element.removeChild(particle.displayObject);
  }

  private static applyTransform(particle: PixiParticle): void
  {
    const displayObject = particle.displayObject;

    displayObject.position.x = particle.p.x;
    displayObject.position.y = particle.p.y;

    displayObject.scale.x = particle.scale;
    displayObject.scale.y = particle.scale;

    displayObject.alpha = particle.alpha;
  }
}
