import * as PIXI from "pixi.js";
import * as Proton from "proton-js";
import * as TWEEN from "@tweenjs/tween.js";

import {Color} from "../../../../src/color/Color";
import
{
  generateTextureWithBounds,
  makeCenteredShaderSprite,
} from "../../../../src/graphics/pixiWrapperFunctions";
import {VfxDrawingFunction} from "../../../../src/templateinterfaces/VfxDrawingFunction";

import {Beam} from "./vfxfragments/Beam";
import {LightBurst} from "./vfxfragments/LightBurst";
import {RampingValue} from "./vfxfragments/RampingValue";
import {ShockWave} from "./vfxfragments/ShockWave";
import {ShinyParticleFilter} from "./shaders/ShinyParticleFilter";
import { FunctionInitialize } from "./proton/FunctionInitialize";
import { ShinyParticleShader } from "./shaders/ShinyParticleShader";
import { PixiRenderer } from "./proton/PixiRenderer";
import { ProtonEmitter } from "./proton/ProtonEmitter";


const relativeImpactTime = 0.18;

export const beam: VfxDrawingFunction = props =>
{
  // ----------INIT GENERAL
  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(
    props.userOffset, props.width, "user");

  const mainContainer = new PIXI.Container();

  let impactHasOccurred = false;

  const beamOrigin = offsetUserData.singleAttackOriginPoint;
  const relativeBeamOrigin =
  {
    x: beamOrigin.x / props.width,
    y: beamOrigin.y / props.height,
  };

  const renderTexture = PIXI.RenderTexture.create(
  {
    width: props.width,
    height: props.height,
  });
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
  mainContainer.addChild(particleContainer);

  const proton = new Proton();
  proton.addRenderer(new PixiRenderer(particleContainer));

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

  // ----------SMALL EMITTER
  const smallEmitter = new ProtonEmitter();
  smallEmitter.p.x = beamOrigin.x + 50;
  smallEmitter.p.y = beamOrigin.y;
  smallEmitter.life = props.duration / 1000 * 0.8;
  smallEmitter.damping = 0.013;

  proton.addEmitter(smallEmitter);

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

  // ----------TEXTURE
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

  // ----------INITIALIZES
  smallEmitter.addInitialize(new FunctionInitialize("createSprite", (particle) =>
  {
    const sprite = particle.displayObject = new PIXI.Sprite(smallParticleTexture);

    sprite.filters = [smallParticleFilter];
    sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  }));

  smallEmitter.addInitialize(new Proton.Velocity(
    new Proton.Span(2.5, 3.5),
    new Proton.Span(270, 35, true),
    "polar",
  ));

  smallEmitter.addInitialize(new Proton.Position(new Proton.RectZone(
    0,
    -30,
    props.width + 100 - smallEmitter.p.x,
    60,
  )));

  smallEmitter.addInitialize(new Proton.Life(new Proton.Span(
    props.duration * (1.0 - relativeImpactTime) / 6000,
    props.duration * (1.0 - relativeImpactTime) / 3000,
  )));

  // ----------BEHAVIOURS
  smallEmitter.addBehaviour(new Proton.Scale(
    new Proton.Span(0.8, 1),
    0,
    Infinity,
    (value) =>
    {
      return Math.max(value, beamFragment.props.lineYSize.lastValue);
    },
  ));
  smallEmitter.addBehaviour(new Proton.RandomDrift(20, 30, props.duration / 2000));

  // ----------SHINY EMITTER
  const shinyEmitter = new ProtonEmitter();
  shinyEmitter.p.x = beamOrigin.x;
  shinyEmitter.p.y = beamOrigin.y;
  shinyEmitter.damping = 0.009;
  shinyEmitter.life = props.duration / 1000 * 0.8;
  shinyEmitter.rate = new Proton.Rate(
    150 * particlesAmountScale, // particles per emit
    0, // time between emits in seconds
  );

  proton.addEmitter(shinyEmitter);

  const shinyParticleShader = new ShinyParticleShader();
  const syncShinyParticleUniforms = (time: number) =>
  {
    const lifeLeft = 1.0 - time;

    shinyParticleShader.setUniforms(
    {
      spikeColor: particleShaderColorArray,
      spikeIntensity: 1 - time * 0.1,
      highlightIntensity: Math.pow(lifeLeft, 2.0),
    });
  };

  // ----------INITIALIZES
  shinyEmitter.addInitialize(new FunctionInitialize("createMesh", (particle =>
  {
    const mesh = particle.displayObject = makeCenteredShaderSprite(shinyParticleShader);

    mesh.blendMode = PIXI.BLEND_MODES.SCREEN;
  })));

  const shinyEmitterLifeInitialize = new Proton.Life(new Proton.Span(
    props.duration / 3000,
    props.duration / 1000,
  ));
  shinyEmitter.addInitialize(shinyEmitterLifeInitialize);

  shinyEmitter.addInitialize(new Proton.Position(new Proton.RectZone(
    0,
    -5,
    props.width + 100 - shinyEmitter.p.x,
    10,
  )));

  // ----------BEHAVIOURS
  shinyEmitter.addBehaviour(new Proton.Scale(
    new Proton.Span(60, 100),
    -20,
    Infinity,
    (value) =>
    {
      return Math.max(value, beamFragment.props.lineYSize.lastValue);
    },
  ));

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
  });

  shockWaveFragment.draw();
  shockWaveFragment.setCenter(beamOrigin.x, beamOrigin.y);

  mainContainer.addChild(shockWaveFragment.displayObject);

  // ----------INIT LIGHTBURST
  const lightBurstSize =
  {
    x: props.height * 1.5,
    y: props.height * 3,
  };

  const lightBurstStartTime = relativeImpactTime - 0.1;
  const lightBurstEndTime = relativeImpactTime + 0.2;

  const lightBurstFragment = new LightBurst(
  {
    size: lightBurstSize,
    peakTime: LightBurst.getRelativePeakTime(relativeImpactTime, lightBurstStartTime, lightBurstEndTime),
    sharpness: 2.0,
    color: new Color(0.75, 0.75, 0.62),
    centerSize: 1.0,
    rayStrength: 1.0,
  });

  lightBurstFragment.draw();
  lightBurstFragment.setCenter(beamOrigin.x, beamOrigin.y);

  mainContainer.addChild(lightBurstFragment.displayObject);

  // ----------ANIMATE

  function animate()
  {
    const elapsedTime = Date.now() - startTime;

    proton.update();

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
        const lifeLeftSecs = props.duration * lifeLeft / 1000;

        const velocityInitialize = new Proton.Velocity(
          new Proton.Span(1.5, 3),
          new Proton.Span(270, 25, true),
          "polar",
        );

        shinyEmitter.addInitialize(velocityInitialize);
        shinyEmitter.particles.forEach(particle =>
        {
          velocityInitialize.initialize(particle);
        });

        shinyEmitter.removeInitialize(shinyEmitterLifeInitialize);
        shinyEmitter.addInitialize(new Proton.Life(new Proton.Span(
          lifeLeftSecs / 5,
          lifeLeftSecs / 3,
        )));

        shinyEmitter.rate = new Proton.Rate(4 * particlesAmountScale, 0.52);
        shinyEmitter.emit();

        smallEmitter.rate = new Proton.Rate(6 * particlesAmountScale, 0.02);
        smallEmitter.emit();

        props.abilityUseEffects.triggerAllEffects();
      }

      syncSmallParticleUniforms(relativeElapsedTime);
    }

    beamFragment.animate(relativeElapsedTime);
    syncShinyParticleUniforms(relativeElapsedTime);
    shockWaveFragment.animateWithinTimeSpan(relativeElapsedTime, relativeImpactTime, 1);
    lightBurstFragment.animateWithinTimeSpan(
      relativeElapsedTime,
      lightBurstStartTime,
      lightBurstEndTime,
    );

    props.renderer.render(mainContainer, renderTexture, true);

    if (elapsedTime < props.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      smallParticleTexture.destroy(true);
      proton.destroy();
      props.triggerEnd();
    }
  }

  props.triggerStart(renderedSprite);

  const startTime = Date.now();
  particleShaderColorTween.start();
  animate();
}
