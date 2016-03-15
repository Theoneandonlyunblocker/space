/// <reference path="protonwrapper.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module BattleSFXFunctions
      {
        export class ShinyParticleFilter extends PIXI.AbstractFilter
        {
          constructor(uniforms?: any)
          {
            super(null, ShaderSources.shinyparticle.join("\n"), uniforms);
          }
        }
        export function particleTest(props: Rance.Templates.SFXParams)
        {
          var width2 = props.width / 2;
          var height2 = props.height / 2;

          var startColor = 0xD1FFF4;
          var endColor = 0x5ECAB1;

          var gfx = new PIXI.Graphics();
          gfx.beginFill(0x5ECAB1);
          gfx.drawCircle(30, 30, 5);
          gfx.endFill();
          // gfx.beginFill(0xFF0000);
          // gfx.drawRect(width2/2, height2/2, width2, height2);
          // gfx.endFill();
          var textureSize = new PIXI.Rectangle(0, 0, 60, 60);
          var texture = gfx.generateTexture(props.renderer, 1, PIXI.SCALE_MODES.DEFAULT, textureSize);
          // var texture = gfx.generateTexture(props.renderer, 1, PIXI.SCALE_MODES.DEFAULT);

          var particleContainer = new PIXI.Container();
          var proton = new ProtonWrapper(props.renderer, particleContainer);

          var bg = new PIXI.Graphics();
          bg.beginFill(0x000000);
          bg.drawRect(0, 0, props.width, props.height);
          bg.endFill();
          particleContainer.addChild(bg);

          var emitter = new Proton.BehaviourEmitter();
          emitter.rate = new Proton.Rate(
            50, // particles per emit
            0 // time between emits in seconds
          );
          emitter.p.x = width2;
          emitter.p.y = height2;

          emitter.addInitialize(new Proton.ImageTarget(texture));

          emitter.addInitialize(new Proton.Life(new Proton.Span(2, props.duration / 1000)));
          // emitter.addInitialize(new Proton.Mass(1));
          emitter.addInitialize(new Proton.Velocity(2, new Proton.Span(270, 30, true), 'polar'));
          emitter.damping = 0.009;

          var zoneHeight2 = 10;
          var emitterZone = new Proton.RectZone(0, -zoneHeight2, width2, zoneHeight2);
          emitter.addInitialize(new Proton.Position(emitterZone));

          // emitter.addBehaviour(new Proton.Gravity(8));
          emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.6, 1), 0));
          emitter.addBehaviour(new Proton.Alpha(0.8, 0));
          // emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-10, 10), 'add'));
          emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, props.width, props.height), "dead"));

          // emitter.addSelfBehaviour(new Proton.Gravity(5));
          emitter.addSelfBehaviour(new Proton.RandomDrift(30, 30, .1));


          proton.addEmitter(emitter, "shinyParticles");

          var filter = new ShinyParticleFilter(
          {
            lifeLeft:
            {
              type: "1f",
              value: 1
            }
          });


          
          proton.onSpriteCreated["shinyParticles"] = function(sprite: PIXI.Sprite)
          {
            sprite.shader = filter;
            sprite.blendMode = PIXI.BLEND_MODES.ADD;
          };

          emitter.emit();
          emitter.emitTotalTimes = "once";



          function animate()
          {
            var elapsedTime = Date.now() - startTime;

            proton.update();
            filter.uniforms.lifeLeft.value = 1 - elapsedTime / props.duration;
            console.log(filter.uniforms.lifeLeft.value);

            if (elapsedTime < props.duration)
            {
              requestAnimationFrame(animate);
            }
            else
            {
              proton.destroy();
              props.triggerEnd();
            }
          }

          props.triggerStart(particleContainer);

          var startTime = Date.now();
          animate();
        }
      }
    }
  }
}
