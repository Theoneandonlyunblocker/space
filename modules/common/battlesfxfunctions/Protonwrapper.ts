/// <reference path="../../../lib/proton.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />

export default class ProtonWrapper
{
  private pixiRenderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  private container: PIXI.Container;

  private proton: Proton;
  private protonRenderer: Proton.Renderer;

  private emitters:
  {
    [key: string]: Proton.Emitter;
  } = {};
  private emitterKeysByID:
  {
    [emitterId: string]: string;
  } = {};

  public onSpriteCreated:
  {
    [key: string]: (sprite: PIXI.Sprite) => void;
  } = {};

  public constructor(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, container: PIXI.Container)
  {
    this.proton = new Proton();
    this.pixiRenderer = renderer;
    this.container = container;

    this.initProtonRenderer();
  }

  public destroy()
  {
    this.pixiRenderer = null;

    for (let key in this.emitters)
    {
      this.removeEmitterWithKey(key);
    }
    this.emitters = {};

    this.protonRenderer.stop(); // start() initializes renderer, stop() destroys it

    this.proton.destroy();
    this.proton = null;
  }

  private initProtonRenderer()
  {
    var renderer = this.protonRenderer = new Proton.Renderer("other", this.proton);

    // TODO performance | .bind might be too much un-needed overhead
    renderer.onParticleCreated = this.onProtonParticleCreated.bind(this);
    renderer.onParticleUpdate = this.onProtonParticleUpdated.bind(this);
    renderer.onParticleDead = this.onProtonParticleDead.bind(this);

    renderer.start(); // start() initializes renderer, stop() destroys it
  }

  private onProtonParticleCreated(particle: Proton.Particle)
  {
    var sprite = new PIXI.Sprite(particle.target);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    particle.sprite = sprite;
    var emitter = <Proton.Emitter> particle.parent;
    var emitterKey = this.emitterKeysByID[emitter.id];
    if (this.onSpriteCreated[emitterKey])
    {
      this.onSpriteCreated[emitterKey](sprite);
    }

    this.container.addChild(sprite);
  }

  private onProtonParticleUpdated(particle: Proton.Particle)
  {
    var sprite: PIXI.DisplayObject = particle.sprite;

    sprite.position.x = particle.p.x;
    sprite.position.y = particle.p.y;

    sprite.scale.x = particle.scale;
    sprite.scale.y = particle.scale;

    sprite.alpha = particle.alpha;

    sprite.rotation = particle.rotation * PIXI.DEG_TO_RAD;

    // todo update other transforms
  }

  private onProtonParticleDead(particle: Proton.Particle)
  {
    this.container.removeChild(particle.sprite);
  }

  private destroyEmitter(emitter: Proton.Emitter)
  {
    emitter.stopEmit();
    emitter.removeAllParticles();
    emitter.destroy();
  }

  public addEmitter(emitter: Proton.Emitter, key: string)
  {
    this.emitters[key] = emitter;
    this.emitterKeysByID[emitter.id] = key;

    this.proton.addEmitter(emitter);
  }
  private getEmitterKeyWithID(id: string)
  {
    return this.emitterKeysByID[id];
  }
  private getEmitterKey(emitter: Proton.Emitter)
  {
    return this.getEmitterKeyWithID(emitter.id) || null;
  }
  public removeEmitterWithKey(key: string)
  {
    var emitter = this.emitters[key];

    this.destroyEmitter(emitter);

    this.emitterKeysByID[emitter.id] = null;
    delete this.emitterKeysByID[emitter.id];
    
    this.emitters[key] = null;
    delete this.emitters[key];
  }
  public removeEmitter(emitter: Proton.Emitter)
  {
    this.removeEmitterWithKey(this.getEmitterKey(emitter));
  }
  public addInitializeToExistingParticles(emitter: Proton.Emitter, initialize: Proton.Initialize)
  {
    emitter.particles.forEach(function(particle: Proton.Particle)
    {
      initialize.initialize(particle);
    });

    emitter.addInitialize(initialize);
  }
  public update()
  {
    this.proton.update();
  }
}
