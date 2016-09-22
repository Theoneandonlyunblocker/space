/// <reference path="../../../lib/tween.js.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import ShinyParticleFilter from "./shaders/ShinyParticle";

import ShockWave from "./sfxfragments/ShockWave";
import LightBurst from "./sfxfragments/LightBurst";
import Beam from "./sfxfragments/Beam";
import RampingValue from "./sfxfragments/RampingValue";

import Color from "../../../src/color";
import
{
  getDummyTextureForShader,
  getRelativeValue
} from "../../../src/utility";

import ProtonWrapper from "./ProtonWrapper";


export default function beam(props: SFXParams)
{
  //----------INIT GENERAL
  var width2 = props.width / 2;
  var height2 = props.height / 2;

  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleSFX(
    props.userOffset, props.width, "user");

  var mainContainer = new PIXI.Container();

  var impactHasOccurred = false;
  var relativeImpactTime = 0.18;

  var beamOrigin = offsetUserData.singleAttackOriginPoint;
  var relativeBeamOrigin =
  {
    x: beamOrigin.x / props.width,
    y: beamOrigin.y / props.height
  }

  var renderTexture = new PIXI.RenderTexture(props.renderer, props.width, props.height);
  var renderedSprite = new PIXI.Sprite(renderTexture);
  if (!props.facingRight)
  {
    renderedSprite.x = props.width;
    renderedSprite.scale.x = -1;
  }

  var finalColor = 
  [
    0.368627450980392,
    0.792156862745098,
    0.694117647058823,
    1.0
  ];

  //----------INIT PARTICLES
  var particleContainer = new PIXI.Container();
  // particleContainer.alpha = 0.1;
  mainContainer.addChild(particleContainer);
  var protonWrapper = new ProtonWrapper(props.renderer, particleContainer);

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
      r: finalColor[0],
      g: finalColor[1],
      b: finalColor[2],
      a: 1.0
    }, props.duration / 2
  );

  var particlesAmountScale = props.width / 700;

  //----------INIT BEAM
  const beamFragment = new Beam(
  {
    color: new Color(finalColor[0], finalColor[1], finalColor[2]),
    relativeImpactTime: relativeImpactTime,
    relativeBeamOrigin: relativeBeamOrigin,
    size:
    {
      x: props.width,
      y: props.height
    },

    timeScale: 100,
    noiseAmplitude: new RampingValue(0.0, 0.4, -0.4),
    lineIntensity: new RampingValue(2.0, 5.0, -5.0),
    bulgeIntensity: new RampingValue(0.0, 6.0, -6.0),
    bulgeSizeX: new RampingValue(0.0, 0.7, -0.7),
    bulgeSizeY: new RampingValue(0.0, 0.4, -0.4),
    lineYSize: new RampingValue(0.01, 0.2, -0.21),
    bulgeSharpness: new RampingValue(0.3, 0.35, -0.35),
    lineXSharpness: new RampingValue(0.99, -0.99, 0.99),
    lineYSharpness: new RampingValue(0.99, -0.15, 0.16),
  });

  beamFragment.draw();
  mainContainer.addChild(beamFragment.displayObject);

  //----------EMITTERS COMMON
  const onParticleUpdateFN = function(particle: Proton.Particle)
  {
    const sprite = <PIXI.DisplayObject> particle.sprite;
    
    sprite.position.x = particle.p.x;
    sprite.position.y = particle.p.y;

    sprite.scale.x = particle.scale;
    sprite.scale.y = particle.scale;
  }
  //----------INIT SMALL EMITTER
  var smallEmitter = new Proton.BehaviourEmitter();
  smallEmitter.p.x = beamOrigin.x + 50;
  smallEmitter.p.y = beamOrigin.y;
  smallEmitter.damping = 0.013;

  var smallParticleGraphicsSize =
  {
    x: 4,
    y: 4
  };
  var smallParticleGraphics = new PIXI.Graphics();
  smallParticleGraphics.beginFill(0x5ECAB1, 1.0);
  smallParticleGraphics.drawRect(
    smallParticleGraphicsSize.x / 2,
    smallParticleGraphicsSize.y / 2,
    smallParticleGraphicsSize.x,
    smallParticleGraphicsSize.y
    );
  smallParticleGraphics.endFill();

  var smallParticleTexture = smallParticleGraphics.generateTexture(props.renderer, 1, PIXI.SCALE_MODES.DEFAULT,
    new PIXI.Rectangle(0, 0, smallParticleGraphicsSize.x * 1.5, smallParticleGraphicsSize.y * 1.5)
  );

  smallEmitter.addInitialize(new Proton.ImageTarget(smallParticleTexture));
  smallEmitter.addInitialize(new Proton.Velocity(new Proton.Span(2.5, 3.5),
    new Proton.Span(270, 35, true), 'polar'));
  smallEmitter.addInitialize(new Proton.Position(new Proton.RectZone(
    0,
    -30,
    props.width + 100 - smallEmitter.p.x,
    30
  )));
  smallEmitter.addInitialize(new Proton.Life(new Proton.Span(
    props.duration * (1.0 - relativeImpactTime) / 6000,
    props.duration * (1.0 - relativeImpactTime) / 3000
  )));

  smallEmitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0));

  smallEmitter.addBehaviour(new Proton.RandomDrift(20, 30, props.duration / 2000));

  protonWrapper.addEmitter(smallEmitter, "smallParticles");

  var smallParticleFilter = new ShinyParticleFilter();
  const syncSmallParticleUniforms = function(time: number)
  {
    var lifeLeft = 1.0 - time;

    smallParticleFilter.setUniformValues(
    {
      spikeColor: particleShaderColorArray,
      spikeIntensity: Math.pow(lifeLeft, 1.5) * 0.4,
      highlightIntensity: Math.pow(lifeLeft, 1.5)
    });
  }

  protonWrapper.onParticleUpdated["smallParticles"] = onParticleUpdateFN;
  protonWrapper.onSpriteCreated["smallParticles"] = function(sprite: PIXI.Sprite)
  {
    sprite.shader = smallParticleFilter;
    sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  };

  //----------INIT SHINY EMITTER
  var shinyEmitter = new Proton.BehaviourEmitter();
  shinyEmitter.p.x = beamOrigin.x;
  shinyEmitter.p.y = beamOrigin.y;

  var shinyParticleTexture = getDummyTextureForShader();
  shinyEmitter.addInitialize(new Proton.ImageTarget(shinyParticleTexture));

  var shinyEmitterLifeInitialize = new Proton.Life(new Proton.Span(props.duration / 3000, props.duration / 1000));
  shinyEmitter.addInitialize(shinyEmitterLifeInitialize);
  shinyEmitter.damping = 0.009;

  var emitterZone = new Proton.RectZone(
    0,
    -5,
    props.width + 100 - shinyEmitter.p.x,
    5
  );
  shinyEmitter.addInitialize(new Proton.Position(emitterZone));

  shinyEmitter.addBehaviour(new Proton.Scale(new Proton.Span(60, 100), 0));
  // shinyEmitter.addBehaviour(new Proton.RandomDrift(5, 10, 0.3));

  protonWrapper.addEmitter(shinyEmitter, "shinyParticles");

  var shinyParticleFilter = new ShinyParticleFilter();
  const syncShinyParticleUniforms = function(time: number)
  {
    var lifeLeft = 1.0 - time;

    shinyParticleFilter.setUniformValues(
    {
      spikeColor: particleShaderColorArray,
      spikeIntensity: 1 - time * 0.1,
      highlightIntensity: Math.pow(lifeLeft, 2.0)
    });
  }

  protonWrapper.onParticleUpdated["shinyParticles"] = onParticleUpdateFN;
  protonWrapper.onSpriteCreated["shinyParticles"] = function(sprite: PIXI.Sprite)
  {
    sprite.shader = shinyParticleFilter;
    sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  };
  
  shinyEmitter.rate = new Proton.Rate(
    150 * particlesAmountScale, // particles per emit
    0 // time between emits in seconds
  );
  shinyEmitter.emit("once");


  //----------INIT SHOCKWAVE
  const shockWaveSize =
  {
    x: props.width * 3.0,
    y: props.height * 3.0
  };
  
  const shockWaveFragment = new ShockWave(
  {
    size: shockWaveSize,
    intersectingEllipseOrigin: {x: 0.05, y: 0.0},
    intersectingEllipseDrift: {x: 0.3, y: 0.0},

    alpha: new RampingValue(1.0, -1.0, 0.0),
    mainEllipseScaleX: new RampingValue(0.0, 0.3, 0.0),
    mainEllipseScaleY: new RampingValue(0.0, 0.9, 0.0),
    mainEllipseSharpness: new RampingValue(0.95, -0.15, 0.0),
    intersectingEllipseScaleX: new RampingValue(0.0, 0.8, 0.0),
    intersectingEllipseScaleY: new RampingValue(0.0, 1.0, 0.0),
    intersectingEllipseSharpness: new RampingValue(0.8, -0.4, 0.0),

    color: new Color(1.0, 1.0, 1.0),

    delay: relativeImpactTime,
  });

  shockWaveFragment.draw();
  shockWaveFragment.position.set(
    beamOrigin.x - shockWaveSize.x / 2,
    beamOrigin.y - shockWaveSize.y / 2
  );

  mainContainer.addChild(shockWaveFragment.displayObject);

  //----------INIT LIGHTBURST
  var lightBurstSize =
  {
    x: props.height * 1.5,
    y: props.height * 3
  }

  const lightBurstFragment = new LightBurst(
  {
    size: lightBurstSize,
    delay: relativeImpactTime,
    sharpness: 2.0,
    color: new Color(0.75, 0.75, 0.62),
    centerSize: 1.0,
    rayStrength: 1.0
  });

  lightBurstFragment.draw();
  lightBurstFragment.position.set(
    beamOrigin.x - lightBurstSize.x / 2,
    beamOrigin.y - lightBurstSize.y / 2
  );

  mainContainer.addChild(lightBurstFragment.displayObject);

  //----------ANIMATE

  function animate()
  {
    var elapsedTime = Date.now() - startTime;

    protonWrapper.update();

    var tweenTime = window.performance.now();

    particleShaderColorTween.update(tweenTime);
    particleShaderColorArray[0] = particleShaderColor.r;
    particleShaderColorArray[1] = particleShaderColor.g;
    particleShaderColorArray[2] = particleShaderColor.b;
    particleShaderColorArray[3] = particleShaderColor.a;

    var relativeElapsedTime = elapsedTime / props.duration
    var lifeLeft = 1 - relativeElapsedTime;
    var relativeTimeSinceImpact = getRelativeValue(relativeElapsedTime, relativeImpactTime, 1.0);

    if (relativeElapsedTime >= relativeImpactTime - 0.02)
    {
      if (!impactHasOccurred)
      {
        impactHasOccurred = true;
        var lifeLeftInSeconds = props.duration * lifeLeft / 1000;
        var emitterLife = lifeLeftInSeconds * 0.8;

        var velocityInitialize = new Proton.Velocity(new Proton.Span(1.5, 3),
          new Proton.Span(270, 25, true), 'polar')
        protonWrapper.addInitializeToExistingParticles(shinyEmitter, velocityInitialize);

        shinyEmitter.removeInitialize(shinyEmitterLifeInitialize);
        shinyEmitter.addInitialize(new Proton.Life(new Proton.Span(emitterLife / 4, emitterLife / 2.5)));

        shinyEmitter.rate = new Proton.Rate(4 * particlesAmountScale, 0.02);
        shinyEmitter.life = emitterLife;
        shinyEmitter.emit();


        smallEmitter.rate = new Proton.Rate(6 * particlesAmountScale, 0.02);
        smallEmitter.life = emitterLife;
        smallEmitter.emit();

        props.triggerEffect();
      }

      syncSmallParticleUniforms(relativeElapsedTime);
    }

    beamFragment.animate(relativeElapsedTime);
    syncShinyParticleUniforms(relativeElapsedTime);
    shockWaveFragment.animate(relativeElapsedTime);
    lightBurstFragment.animate(relativeElapsedTime);

    renderTexture.clear();
    renderTexture.render(mainContainer);

    if (elapsedTime < props.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      smallParticleTexture.destroy(true);
      protonWrapper.destroy();
      props.triggerEnd();
    }
  }

  props.triggerStart(renderedSprite);

  var startTime = Date.now();
  particleShaderColorTween.start();
  animate();
}
