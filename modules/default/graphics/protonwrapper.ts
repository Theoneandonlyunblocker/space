/// <reference path="../../../lib/proton.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />

// Proton.Rate(amountOfParticlesPerEmit, timeBetweenEmits)

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export class ProtonWrapper
      {
        pixiRenderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        container: PIXI.Container;

        proton: Proton;
        protonRenderer: Proton.Renderer;

        emitters: Proton.Emitter[];

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

          for (var i = 0; i < this.emitters.length; i++)
          {
            this.destroyEmitter(this.emitters[i]);
          }

          this.emitters = [];

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
          particle.sprite = sprite;
          this.container.addChild(sprite);
        }

        private onProtonParticleUpdated(particle: Proton.Particle)
        {
          var sprite: PIXI.DisplayObject = particle.sprite;

          sprite.position.x = particle.p.x;
          sprite.position.y = particle.p.y;
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

        public addEmitter(emitter: Proton.Emitter)
        {
          this.emitters.push(emitter);
          emitter.emit() // Emitter.emit() initializes emitter

          this.proton.addEmitter(emitter);
        }

        public removeEmitter(emitter: Proton.Emitter)
        {
          var i = this.emitters.indexOf(emitter);

          if (i === -1)
          {
            throw new Error("No such emitter");
          }

          this.emitters.splice(i, 1);
          this.destroyEmitter(emitter);
        }

        public update()
        {
          this.proton.update();
        }
      }
    }
  }
}
