/// <reference path="../../../lib/tween.js.d.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import BeamFilter from "./shaders/Beam";
import ShinyParticleFilter from "./shaders/ShinyParticle";
import LightBurstFilter from "./shaders/LightBurst";

import ShockWave from "./sfxfragments/ShockWave";

import Color from "../../../src/color";
import
{
  createDummySpriteForShader,
  getDummyTextureForShader,
  getRelativeValue
} from "../../../src/utility";

import ProtonWrapper from "./ProtonWrapper";


export default function particleTest(props: SFXParams)
{
  //----------INIT GENERAL
  var width2 = props.width / 2;
  var height2 = props.height / 2;

  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleSFX(
    props.userOffset, props.user);

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
  var beamSpriteSize =
  {
    x: props.width,
    y: props.height
  }
  
  const beamFilter = new BeamFilter(
  {
    seed: Math.random() * 100,
    beamColor: finalColor,
    aspectRatio: beamSpriteSize.x / beamSpriteSize.y,
    bulgeXPosition: relativeBeamOrigin.x + 0.1
  });
  const syncBeamUniforms = function(time: number)
  {
    var rampUpValue = Math.min(time / relativeImpactTime, 1.0);
    rampUpValue = Math.pow(rampUpValue, 7.0);

    var timeAfterImpact = Math.max(time - relativeImpactTime, 0.0);
    var relativeTimeAfterImpact = getRelativeValue(timeAfterImpact, 0.0, 1.0 - relativeImpactTime);

    var rampDownValue = Math.min(Math.pow(relativeTimeAfterImpact * 1.2, 12.0), 1.0);
    var beamIntensity = rampUpValue - rampDownValue;

    beamFilter.setUniformValues(
    {
      time: time * 100,
      noiseAmplitude: 0.4 * beamIntensity,
      lineIntensity: 2.0 + 3.0 * beamIntensity,
      bulgeIntensity: 6.0 * beamIntensity,

      bulgeSize:
      [
        0.7 * Math.pow(beamIntensity, 1.5),
        0.4 * Math.pow(beamIntensity, 1.5)
      ],
      bulgeSharpness: 0.3 + 0.35 * beamIntensity,

      lineXSize:
      [
        relativeBeamOrigin.x * rampUpValue,
        1.0
      ],
      lineXSharpness: 0.99 - beamIntensity * 0.99,

      lineYSize: 0.001 + beamIntensity * 0.03,
      lineYSharpness: 0.99 - beamIntensity * 0.15 + 0.01 * rampDownValue
    });
  };

  var beamSprite = createDummySpriteForShader(
    0,
    beamOrigin.y - beamSpriteSize.y / 2,
    beamSpriteSize.x,
    beamSpriteSize.y
  );
  beamSprite.shader = beamFilter;
  beamSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

  mainContainer.addChild(beamSprite);

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
  const shockWaveFragment = new ShockWave(
  {
    origin: beamOrigin,
    size: {x: props.width * 3.0, y: props.height * 3.0},
    mainEllipseMaxScale: {x: 0.3, y: 0.9},
    intersectingEllipseMaxScale: {x: 0.8, y: 1.0},
    intersectingEllipseOrigin: {x: 0.05, y: 0.0},
    intersectingEllipseDrift: {x: 0.3, y: 0.0},
    color: new Color(1.0, 1.0, 1.0),
    relativeImpactTime: relativeImpactTime
  });
  // const shockWaveFragment = shockWave(props,
  // {
  //   origin: beamOrigin,
  //   size: {x: props.width * 3.0, y: props.height * 3.0},
  //   mainEllipseMaxScale: {x: 0.3, y: 0.9},
  //   intersectingEllipseMaxScale: {x: 0.8, y: 1.0},
  //   intersectingEllipseOrigin: {x: 0.05, y: 0.0},
  //   intersectingEllipseDrift: {x: 0.3, y: 0.0},
  //   color: new Color(1.0, 1.0, 1.0),
  //   relativeImpactTime: relativeImpactTime
  // });

  // mainContainer.addChild(shockWaveFragment.displayObject);


  //----------INIT LIGHTBURST
  var lightBurstFilter = new LightBurstFilter(
  {
    seed: [Math.random() * 69, Math.random() * 420],
    rotation: 0.0,
    raySharpness: 2.0,
    rayColor: [0.75, 0.75, 0.62, 1.0]
  });
  const syncLightBurstUniforms = function(time: number)
  {
    var rampUpValue = Math.min(time / relativeImpactTime, 1.0);
    rampUpValue = Math.pow(rampUpValue, 7.0);

    var timeAfterImpact = Math.max(time - relativeImpactTime, 0.0);
    var rampDownValue = Math.pow(timeAfterImpact * 5.0, 2.0);

    var lightBurstIntensity = Math.max(rampUpValue - rampDownValue, 0.0);

    lightBurstFilter.setUniformValues(
    {
      centerSize: Math.pow(lightBurstIntensity, 2.0),
      centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
      rayStrength: Math.pow(lightBurstIntensity, 3.0)
    });
  }




  var lightBurstSize =
  {
    x: props.height * 1.5,
    y: props.height * 3
  }
  var lightBurstSprite = createDummySpriteForShader(
    beamOrigin.x - lightBurstSize.x / 2,
    beamOrigin.y - lightBurstSize.y / 2,
    lightBurstSize.x,
    lightBurstSize.y
  );
  lightBurstSprite.shader = lightBurstFilter;
  lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

  mainContainer.addChild(lightBurstSprite);

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

    var timePassed = elapsedTime / props.duration
    var lifeLeft = 1 - timePassed;
    var timePassedSinceImpact = getRelativeValue(timePassed, relativeImpactTime, 1.0);

    if (timePassed >= relativeImpactTime - 0.02)
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

      syncSmallParticleUniforms(timePassed);
    }

    syncBeamUniforms(timePassed);
    syncShinyParticleUniforms(timePassed);
    shockWaveFragment.animate(timePassed);
    syncLightBurstUniforms(timePassed);

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
