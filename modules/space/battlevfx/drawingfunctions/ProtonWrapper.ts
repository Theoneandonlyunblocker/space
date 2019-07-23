// TODO global ref
// /// <reference path="../../../../lib/proton.d.ts" />
import * as PIXI from "pixi.js";

export class ProtonWrapper
{
  public onSpriteCreated:
  {
    [emitterKey: string]: (sprite: PIXI.Sprite) => void;
  } = {};
  public onParticleUpdated:
  {
    [emitterKey: string]: (particle: Proton.Particle) => void;
  } = {};

  private container: PIXI.Container;

  private proton: Proton;
  private protonRenderer: Proton.Renderer;

  private emitters:
  {
    [emitterKey: string]: Proton.Emitter;
  } = {};
  private emitterKeysById:
  {
    [emitterId: string]: string;
  } = {};

  constructor(container: PIXI.Container)
  {
    this.proton = new Proton();
    this.container = container;

    this.initProtonRenderer();
  }

  public destroy(): void
  {
    for (const key in this.emitters)
    {
      this.removeEmitterWithKey(key);
    }
    this.emitters = {};

    this.protonRenderer.stop(); // start() initializes renderer, stop() destroys it

    this.proton.destroy();
    this.proton = null;
  }
  public addEmitter(emitter: Proton.Emitter, key: string): void
  {
    this.emitters[key] = emitter;
    this.emitterKeysById[emitter.id] = key;

    this.proton.addEmitter(emitter);
  }
  public removeEmitterWithKey(key: string): void
  {
    const emitter = this.emitters[key];

    this.destroyEmitter(emitter);

    this.emitterKeysById[emitter.id] = null;
    delete this.emitterKeysById[emitter.id];

    this.emitters[key] = null;
    delete this.emitters[key];
  }
  public removeEmitter(emitter: Proton.Emitter): void
  {
    this.removeEmitterWithKey(this.getEmitterKey(emitter));
  }
  public addInitializeToExistingParticles(emitter: Proton.Emitter, initialize: Proton.Initialize): void
  {
    emitter.particles.forEach(particle => initialize.initialize(particle));

    emitter.addInitialize(initialize);
  }
  public update(): void
  {
    this.proton.update();
  }

  private initProtonRenderer(): void
  {
    const renderer = this.protonRenderer = new Proton.Renderer("other", this.proton);

    renderer.onParticleCreated = this.onProtonParticleCreated.bind(this);
    renderer.onParticleUpdate = this.onProtonParticleUpdated.bind(this);
    renderer.onParticleDead = this.onProtonParticleDead.bind(this);

    renderer.start(); // start() initializes renderer, stop() destroys it
  }
  private onProtonParticleCreated(particle: Proton.Particle): void
  {
    const sprite = new PIXI.Sprite(particle.target);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    particle.sprite = sprite;
    const emitter = <Proton.Emitter> particle.parent;
    const emitterKey = this.emitterKeysById[emitter.id];
    if (this.onSpriteCreated[emitterKey])
    {
      this.onSpriteCreated[emitterKey](sprite);
    }

    this.container.addChild(sprite);
  }
  private onProtonParticleUpdated(particle: Proton.Particle): void
  {
    if (particle.parent)
    {
      const emitter = <Proton.Emitter> particle.parent;
      const emitterKey = this.emitterKeysById[emitter.id];
      if (this.onParticleUpdated[emitterKey])
      {
        this.onParticleUpdated[emitterKey](particle);
      }
    }
  }
  private onProtonParticleDead(particle: Proton.Particle): void
  {
    this.container.removeChild(particle.sprite);
  }
  private destroyEmitter(emitter: Proton.Emitter): void
  {
    emitter.stopEmit();
    emitter.removeAllParticles();
    emitter.destroy();
  }
  private getEmitterKeyWithId(id: string): string
  {
    return this.emitterKeysById[id];
  }
  private getEmitterKey(emitter: Proton.Emitter): string
  {
    return this.getEmitterKeyWithId(emitter.id) || null;
  }
}
