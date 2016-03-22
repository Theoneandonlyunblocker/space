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
        export class LightBurstFilter extends PIXI.AbstractFilter
        {
          constructor(uniforms?: any)
          {
            super(null, ShaderSources.lightburst.join("\n"), uniforms);
          }
        }
        export class IntersectingEllipsesFilter extends PIXI.AbstractFilter
        {
          constructor(uniforms?: any)
          {
            super(null, ShaderSources.intersectingellipses.join("\n"), uniforms);
          }
        }
        export function particleTest(props: Rance.Templates.SFXParams)
        {
          //----------INIT GENERAL
          var width2 = props.width / 2;
          var height2 = props.height / 2;

          var mainContainer = new PIXI.Container();
          var bg = new PIXI.Graphics();
          bg.beginFill(0x000000);
          bg.drawRect(0, 0, props.width, props.height);
          bg.endFill();
          bg.alpha = 1.0;
          // mainContainer.addChild(bg);

          var impactHasOccurred = false;
          var relativeImpactTime = 0.24;

          var beamOrigin =
          {
            x: 100,
            y: props.height * 0.66
          }

          var renderTexture = new PIXI.RenderTexture(props.renderer, props.width, props.height);
          var renderedSprite = new PIXI.Sprite(renderTexture);
          if (!props.facingRight)
          {
            renderedSprite.x = props.width;
            renderedSprite.scale.x = -1;
          }

          //----------INIT PARTICLES
          var particleContainer = new PIXI.Container();
          particleContainer.alpha = 0.1;
          mainContainer.addChild(particleContainer);
          var protonWrapper = new ProtonWrapper(props.renderer, particleContainer);

          var particleTexture = getDummyTextureForShader();

          var particleShaderColor =
          {
            r: 1.0,
            g: 1.0,
            b: 1.0,
            a: 1.0
          };
          var particleShaderColorArray =
          [
            particleShaderColor.r,
            particleShaderColor.g,
            particleShaderColor.b,
            particleShaderColor.a
          ];
          var particleShaderColorTween = new TWEEN.Tween(particleShaderColor).to(
            {
              r: 0.3686274509803922,
              g: 0.792156862745098,
              b: 0.6941176470588235,
              a: 1.0
            }, props.duration / 2
          );

          var particlesAmountScale = props.width / 700;

          //----------INIT SHINY EMITTER
          var shinyEmitter = new Proton.BehaviourEmitter();
          shinyEmitter.p.x = beamOrigin.x;
          shinyEmitter.p.y = beamOrigin.y;

          shinyEmitter.addInitialize(new Proton.ImageTarget(particleTexture));

          var shinyEmitterLifeInitialize = new Proton.Life(new Proton.Span(props.duration / 3000, props.duration / 1000));
          shinyEmitter.addInitialize(shinyEmitterLifeInitialize);
          // shinyEmitter.addInitialize(new Proton.Mass(1));
          shinyEmitter.damping = 0.009;

          var emitterZone = new Proton.RectZone(
            0,
            -5,
            props.width + 100 - shinyEmitter.p.x,
            5
          );
          shinyEmitter.addInitialize(new Proton.Position(emitterZone));

          // shinyEmitter.addBehaviour(new Proton.Gravity(8));
          shinyEmitter.addBehaviour(new Proton.Scale(new Proton.Span(60, 80), 0));
          shinyEmitter.addBehaviour(new Proton.Alpha(1, 0));
          // shinyEmitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-10, 10), 'add'));
          // shinyEmitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, props.width, props.height), "dead"));

          // shinyEmitter.addSelfBehaviour(new Proton.Gravity(5));
          // shinyEmitter.addBehaviour(new Proton.RandomDrift(5, 10, 0.3));

          protonWrapper.addEmitter(shinyEmitter, "shinyParticles");

          var shinyEmitterFilter = new ShinyParticleFilter(
          {
            spikeColor:
            {
              type: "4fv",
              value: particleShaderColorArray
            },
            spikeIntensity:
            {
              type: "1f",
              value: 1
            },
            highlightIntensity:
            {
              type: "1f",
              value: 0.1
            }
          });

          protonWrapper.onSpriteCreated["shinyParticles"] = function(sprite: PIXI.Sprite)
          {
            sprite.shader = shinyEmitterFilter;
            sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
          };
          
          shinyEmitter.rate = new Proton.Rate(
            100 * particlesAmountScale, // particles per emit
            0 // time between emits in seconds
          );
          shinyEmitter.emit("once");


          //----------INIT SMALL EMITTER
          var smallEmitter = new Proton.BehaviourEmitter();
          smallEmitter.p.x = beamOrigin.x + 50;
          smallEmitter.p.y = beamOrigin.y;
          smallEmitter.damping = 0.011;

          smallEmitter.addInitialize(new Proton.ImageTarget(particleTexture));
          smallEmitter.addInitialize(new Proton.Life(
            new Proton.Span(props.duration / 5000, props.duration / 1000)));
          smallEmitter.addInitialize(new Proton.Velocity(3, new Proton.Span(270, 35, true), 'polar'));
          smallEmitter.addInitialize(new Proton.Position(new Proton.RectZone(
            0,
            -30,
            props.width + 100 - smallEmitter.p.x,
            30
          )));

          smallEmitter.addBehaviour(new Proton.Scale(new Proton.Span(20, 24), 0));
          smallEmitter.addBehaviour(new Proton.Alpha(1, 0));

          smallEmitter.addBehaviour(new Proton.RandomDrift(5, 10, props.duration / 10000));

          protonWrapper.addEmitter(smallEmitter, "smallParticles");

          var smallEmitterFilter = new ShinyParticleFilter(
          {
            spikeColor:
            {
              type: "4fv",
              value: particleShaderColorArray
            },
            spikeIntensity:
            {
              type: "1f",
              value: 0.6
            },
            highlightIntensity:
            {
              type: "1f",
              value: 2.5
            }
          });

          protonWrapper.onSpriteCreated["smallParticles"] = function(sprite: PIXI.Sprite)
          {
            sprite.shader = smallEmitterFilter;
            sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
          };

          //----------INIT LIGHTBURST
          var lightBurstFilter = new LightBurstFilter(
          {
            seed:
            {
              type: "2fv",
              value: [Math.random() * 69, Math.random() * 420]
            },
            rotation:
            {
              type: "1f",
              value: 0.0
            },
            rayStrength:
            {
              type: "1f",
              value: 0.9
            },
            raySharpness:
            {
              type: "1f",
              value: 2.0
            },
            rayColor:
            {
              type: "4fv",
              value: [0.6, 0.6, 0.5, 1.0]
            },
            centerSize:
            {
              type: "1f",
              value: 1.0
            },
            centerBloomStrength:
            {
              type: "1f",
              value: 5.0
            }
          });

          var lightBurstContainer = new PIXI.Container;

          var lightBurstSize =
          {
            x: props.height + 200,
            y: props.height + 200
          }
          var lightBurstSprite = createDummySpriteForShader(
            beamOrigin.x - lightBurstSize.x / 2,
            beamOrigin.y - lightBurstSize.y / 2,
            lightBurstSize.x,
            lightBurstSize.y
          );
          lightBurstSprite.shader = lightBurstFilter;
          lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
          lightBurstContainer.addChild(lightBurstSprite);

          mainContainer.addChild(lightBurstContainer);

          function getLightBurstIntensity(time: number)
          {
            var rampUpValue = Math.min(time / relativeImpactTime, 1.0);
            rampUpValue = Math.pow(rampUpValue, 7.0);

            var rampDownValue = Math.pow(time, 2.0);

            return rampUpValue - rampDownValue;
          }

          function animate()
          {
            var elapsedTime = Date.now() - startTime;

            protonWrapper.update();

            particleShaderColorTween.update(window.performance.now());
            particleShaderColorArray[0] = particleShaderColor.r;
            particleShaderColorArray[1] = particleShaderColor.g;
            particleShaderColorArray[2] = particleShaderColor.b;
            particleShaderColorArray[3] = particleShaderColor.a;

            var timePassed = elapsedTime / props.duration
            var lifeLeft = 1 - timePassed;

            if (timePassed >= relativeImpactTime - 0.02)
            {
              if (!impactHasOccurred)
              {
                impactHasOccurred = true;

                var velocityInitialize = new Proton.Velocity(2, new Proton.Span(270, 35, true), 'polar')
                protonWrapper.addInitializeToExistingParticles(shinyEmitter, velocityInitialize);

                shinyEmitter.removeInitialize(shinyEmitterLifeInitialize);
                shinyEmitter.addInitialize(new Proton.Life(new Proton.Span(props.duration * lifeLeft / 3000,
                  props.duration * lifeLeft / 1000)))

                shinyEmitter.rate = new Proton.Rate(150 * particlesAmountScale, 0);
                shinyEmitter.emit("once");

                // smallEmitter.rate = new Proton.Rate(250 * particlesAmountScale, 0);
                // smallEmitter.emit("once");

                props.triggerEffect();
              }
              
              smallEmitterFilter.uniforms.spikeColor.value = particleShaderColorArray;
              smallEmitterFilter.uniforms.spikeIntensity.value = Math.pow(lifeLeft, 1.5) * 0.4;
              // smallEmitterFilter.uniforms.highlightIntensity.value = Math.pow(lifeLeft, 1.5);
            }

            shinyEmitterFilter.uniforms.spikeColor.value = particleShaderColorArray;
            shinyEmitterFilter.uniforms.spikeIntensity.value = 1 - timePassed * 0.1;
            shinyEmitterFilter.uniforms.highlightIntensity.value = Math.pow(lifeLeft, 2.0);

            var lightBurstIntensity = getLightBurstIntensity(timePassed);
            lightBurstFilter.uniforms.centerSize.value = Math.pow(lightBurstIntensity, 2.0);
            lightBurstFilter.uniforms.centerBloomStrength.value = Math.pow(lightBurstIntensity, 2.0) * 5.0;
            lightBurstFilter.uniforms.rayStrength.value = Math.pow(lightBurstIntensity, 3.0);

            renderTexture.clear();
            renderTexture.render(mainContainer);

            if (elapsedTime < props.duration)
            {
              requestAnimationFrame(animate);
            }
            else
            {
              protonWrapper.destroy();
              props.triggerEnd();
            }
          }

          props.triggerStart(renderedSprite);

          var startTime = Date.now();
          particleShaderColorTween.start();
          animate();
        }
      }
    }
  }
}
