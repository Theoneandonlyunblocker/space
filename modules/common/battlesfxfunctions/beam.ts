/// <reference path="../../../lib/tween.js.d.ts" />
import * as PIXI from "pixi.js";

import Color from "../../../src/Color";
import
{
  attachShaderToSprite,
  generateTextureWithBounds,
  getDummyTextureForShader,
} from "../../../src/pixiWrapperFunctions";
import SfxParams from "../../../src/templateinterfaces/SfxParams";

import ProtonWrapper from "./ProtonWrapper";
import Beam from "./sfxfragments/Beam";
import LightBurst from "./sfxfragments/LightBurst";
import RampingValue from "./sfxfragments/RampingValue";
import ShockWave from "./sfxfragments/ShockWave";
import ShinyParticleFilter from "./shaders/ShinyParticle";


export default function beam(props: SfxParams)
{
  // ----------INIT GENERAL
  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleSfx(
    props.userOffset, props.width, "user");

  const mainContainer = new PIXI.Container();

  let impactHasOccurred = false;
  const relativeImpactTime = 0.18;

  const beamOrigin = offsetUserData.singleAttackOriginPoint;
  const relativeBeamOrigin =
  {
    x: beamOrigin.x / props.width,
    y: beamOrigin.y / props.height,
  };

  const renderTexture = PIXI.RenderTexture.create(props.width, props.height);
  const renderedSprite = new PIXI.Sprite(renderTexture);
  if (!props.facingRight)
  {
    renderedSprite.x = props.width;
    renderedSprite.scale.x = -1;
  }

  const finalColor =
  [
    0.368627450980392,
    0.792156862745098,
    0.694117647058823,
    1.0,
  ];

  // ----------INIT PARTICLES
  const particleContainer = new PIXI.Container();
  // particleContainer.alpha = 0.1;
  mainContainer.addChild(particleContainer);
  const protonWrapper = new ProtonWrapper(particleContainer);

  const particleShaderColor =
  {
    r: 1.0,
    g: 1.0,
    b: 1.0,
    a: 1.0,
  };
  const particleShaderColorArray =
  [
    particleShaderColor.r,
    particleShaderColor.g,
    particleShaderColor.b,
    particleShaderColor.a,
  ];
  const particleShaderColorTween = new TWEEN.Tween(particleShaderColor).to(
    {
      r: finalColor[0],
      g: finalColor[1],
      b: finalColor[2],
      a: 1.0,
    }, props.duration / 2,
  );

  const particlesAmountScale = props.width / 700;

  // ----------INIT BEAM
  const beamFragment = new Beam(
  {
    color: new Color(finalColor[0], finalColor[1], finalColor[2]),
    relativeImpactTime: relativeImpactTime,
    relativeBeamOrigin: relativeBeamOrigin,
    size:
    {
      x: props.width,
      y: props.height,
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

  // ----------EMITTERS COMMON
  const onParticleUpdateFN = (particle: Proton.Particle) =>
  {
    const sprite = <PIXI.DisplayObject> particle.sprite;

    sprite.position.x = particle.p.x;
    sprite.position.y = particle.p.y;

    sprite.scale.x = particle.scale;
    sprite.scale.y = particle.scale;
  };
  // ----------INIT SMALL EMITTER
  const smallEmitter = new Proton.BehaviourEmitter();
  smallEmitter.p.x = beamOrigin.x + 50;
  smallEmitter.p.y = beamOrigin.y;
  smallEmitter.damping = 0.013;

  const smallParticleGraphicsSize =
  {
    x: 4,
    y: 4,
  };
  const smallParticleGraphics = new PIXI.Graphics();
  smallParticleGraphics.beginFill(0x5ECAB1, 1.0);
  smallParticleGraphics.drawRect(
    smallParticleGraphicsSize.x / 2,
    smallParticleGraphicsSize.y / 2,
    smallParticleGraphicsSize.x,
    smallParticleGraphicsSize.y,
    );
  smallParticleGraphics.endFill();

  const smallParticleTexture = generateTextureWithBounds(
    props.renderer,
    smallParticleGraphics,
    PIXI.settings.SCALE_MODE,
    1,
    new PIXI.Rectangle(0, 0, smallParticleGraphicsSize.x * 1.5, smallParticleGraphicsSize.y * 1.5),
  );

  smallEmitter.addInitialize(new Proton.ImageTarget(smallParticleTexture));
  smallEmitter.addInitialize(new Proton.Velocity(new Proton.Span(2.5, 3.5),
    new Proton.Span(270, 35, true), "polar"));
  smallEmitter.addInitialize(new Proton.Position(new Proton.RectZone(
    0,
    -30,
    props.width + 100 - smallEmitter.p.x,
    30,
  )));
  smallEmitter.addInitialize(new Proton.Life(new Proton.Span(
    props.duration * (1.0 - relativeImpactTime) / 6000,
    props.duration * (1.0 - relativeImpactTime) / 3000,
  )));

  smallEmitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0));

  smallEmitter.addBehaviour(new Proton.RandomDrift(20, 30, props.duration / 2000));

  protonWrapper.addEmitter(smallEmitter, "smallParticles");

  const smallParticleFilter = new ShinyParticleFilter();
  const syncSmallParticleUniforms = (time: number) =>
  {
    const lifeLeft = 1.0 - time;

    smallParticleFilter.setUniforms(
    {
      spikeColor: particleShaderColorArray,
      spikeIntensity: Math.pow(lifeLeft, 1.5) * 0.4,
      highlightIntensity: Math.pow(lifeLeft, 1.5),
    });
  };

  protonWrapper.onParticleUpdated["smallParticles"] = onParticleUpdateFN;
  protonWrapper.onSpriteCreated["smallParticles"] = (sprite) =>
  {
    attachShaderToSprite(sprite, smallParticleFilter);
    sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  };

  // ----------INIT SHINY EMITTER
  const shinyEmitter = new Proton.BehaviourEmitter();
  shinyEmitter.p.x = beamOrigin.x;
  shinyEmitter.p.y = beamOrigin.y;

  const shinyParticleTexture = getDummyTextureForShader();
  shinyEmitter.addInitialize(new Proton.ImageTarget(shinyParticleTexture));

  const shinyEmitterLifeInitialize = new Proton.Life(new Proton.Span(props.duration / 3000, props.duration / 1000));
  shinyEmitter.addInitialize(shinyEmitterLifeInitialize);
  shinyEmitter.damping = 0.009;

  const emitterZone = new Proton.RectZone(
    0,
    -5,
    props.width + 100 - shinyEmitter.p.x,
    5,
  );
  shinyEmitter.addInitialize(new Proton.Position(emitterZone));

  shinyEmitter.addBehaviour(new Proton.Scale(new Proton.Span(60, 100), 0));
  // shinyEmitter.addBehaviour(new Proton.RandomDrift(5, 10, 0.3));

  protonWrapper.addEmitter(shinyEmitter, "shinyParticles");

  const shinyParticleFilter = new ShinyParticleFilter();
  const syncShinyParticleUniforms = (time: number) =>
  {
    const lifeLeft = 1.0 - time;

    shinyParticleFilter.setUniforms(
    {
      spikeColor: particleShaderColorArray,
      spikeIntensity: 1 - time * 0.1,
      highlightIntensity: Math.pow(lifeLeft, 2.0),
    });
  };

  protonWrapper.onParticleUpdated["shinyParticles"] = onParticleUpdateFN;
  protonWrapper.onSpriteCreated["shinyParticles"] = (sprite) =>
  {
    attachShaderToSprite(sprite, shinyParticleFilter);
    sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  };

  shinyEmitter.rate = new Proton.Rate(
    150 * particlesAmountScale, // particles per emit
    0, // time between emits in seconds
  );
  shinyEmitter.emit("once");


  // ----------INIT SHOCKWAVE
  const shockWaveSize =
  {
    x: props.width * 3.0,
    y: props.height * 3.0,
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
    beamOrigin.y - shockWaveSize.y / 2,
  );

  mainContainer.addChild(shockWaveFragment.displayObject);

  // ----------INIT LIGHTBURST
  const lightBurstSize =
  {
    x: props.height * 1.5,
    y: props.height * 3,
  };

  const lightBurstFragment = new LightBurst(
  {
    size: lightBurstSize,
    delay: relativeImpactTime,
    sharpness: 2.0,
    color: new Color(0.75, 0.75, 0.62),
    centerSize: 1.0,
    rayStrength: 1.0,
  });

  lightBurstFragment.draw();
  lightBurstFragment.position.set(
    beamOrigin.x - lightBurstSize.x / 2,
    beamOrigin.y - lightBurstSize.y / 2,
  );

  mainContainer.addChild(lightBurstFragment.displayObject);

  // ----------ANIMATE

  function animate()
  {
    const elapsedTime = Date.now() - startTime;

    protonWrapper.update();

    const tweenTime = window.performance.now();

    particleShaderColorTween.update(tweenTime);
    particleShaderColorArray[0] = particleShaderColor.r;
    particleShaderColorArray[1] = particleShaderColor.g;
    particleShaderColorArray[2] = particleShaderColor.b;
    particleShaderColorArray[3] = particleShaderColor.a;

    const relativeElapsedTime = elapsedTime / props.duration;
    const lifeLeft = 1 - relativeElapsedTime;

    if (relativeElapsedTime >= relativeImpactTime - 0.02)
    {
      if (!impactHasOccurred)
      {
        impactHasOccurred = true;
        const lifeLeftInSeconds = props.duration * lifeLeft / 1000;
        const emitterLife = lifeLeftInSeconds * 0.8;

        const velocityInitialize = new Proton.Velocity(new Proton.Span(1.5, 3),
          new Proton.Span(270, 25, true), "polar");
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

    props.renderer.render(mainContainer, renderTexture, true);

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

  const startTime = Date.now();
  particleShaderColorTween.start();
  animate();
}
