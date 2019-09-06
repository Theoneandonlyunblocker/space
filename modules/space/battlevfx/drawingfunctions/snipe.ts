import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import {VfxParams} from "core/templateinterfaces/VfxParams";

import {Color} from "core/color/Color";
import {UnitAttribute} from "core/unit/UnitAttributes";
import
{
  generateTextureWithBounds,
} from "core/graphics/pixiWrapperFunctions";

import {FocusingBeam} from "./vfxfragments/FocusingBeam";
import {RampingValue} from "./vfxfragments/RampingValue";

import {ColorMatrixFilter} from "./ColorMatrixFilter";
import {resources} from "../resources";
import { PixiRenderer } from "./proton/PixiRenderer";
import { FunctionInitialize } from "./proton/FunctionInitialize";
import { PixiParticle } from "./proton/PixiParticle";
import { ProjectileWithImpact } from "./vfxfragments/ProjectileWithImpact";
import { Projectile } from "./vfxfragments/Projectile";
import { getRelativeValue } from "core/generic/utility";


const colors =
{
  [UnitAttribute.Attack]: Color.fromHexString("FF4D77"),
  [UnitAttribute.Defence]: Color.fromHexString("0BB1FF"),
  [UnitAttribute.Intelligence]: Color.fromHexString("EB12FE"),
  [UnitAttribute.Speed]: Color.fromHexString("12FE9E"),
};

for (const attribute in colors)
{
  const color: Color = colors[attribute];

  const hsv = color.getHSV();
  hsv[1] = 0.6;

  colors[attribute] = Color.fromHSV(...hsv);
}

export function snipe(type: UnitAttribute, params: VfxParams)
{
  // ----------INIT
  const mainContainer = new PIXI.Container();

  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleVfx(
    params.userOffset, params.width, "user");
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleVfx(
    params.targetOffset, params.width, "target");

  const renderTexture = PIXI.RenderTexture.create(
  {
    width: params.width,
    height: params.height,
  });
  const renderedSprite = new PIXI.Sprite(renderTexture);
  if (!params.facingRight)
  {
    renderedSprite.x = params.width;
    renderedSprite.scale.x = -1;
  }

  const beamOrigin = offsetUserData.singleAttackOriginPoint;
  const relativeBeamOrigin =
  {
    x: beamOrigin.x / params.width,
    y: beamOrigin.y / params.height,
  };
  const focusDuration = 0.15;
  const projectileLaunchTime = 0.35;
  const impactTime = 0.5;
  const projectileFlightDuration = impactTime - projectileLaunchTime;
  let impactHasOccurred = false;


  // ----------FOCUSING BEAM
  const beamFragment = new FocusingBeam(
  {
    color: colors[type].saturate(-0.1),
    size:
    {
      x: params.width,
      y: params.height,
    },
    focusStartTime: 0,
    focusEndTime: focusDuration,
    decayStartTime: projectileLaunchTime,
    decayEndtime: projectileLaunchTime + projectileFlightDuration / 5,
    focusTimeExponent: 0.33,
    relativeYPosition: relativeBeamOrigin.y,

    beamIntensity: new RampingValue(5.0, 20.0, -25.0),
    beamSharpness: new RampingValue(0.75, 0.24, 0.0),
    beamSize: new RampingValue(0.12, -0.115, -0.005),
  });

  beamFragment.draw();
  mainContainer.addChild(beamFragment.displayObject);

  // ----------PROJECTILE
  const projectileDuration = 1 - projectileLaunchTime;

  const projectileColorMatrixFilter = new ColorMatrixFilter();
  projectileColorMatrixFilter.multiplyByColor(colors[type]);
  projectileColorMatrixFilter.multiplyRGB(3.0);

  const projectileFragment = new ProjectileWithImpact<PIXI.Sprite>(
  {
    impactPosition: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
    removeAfterImpact: true,
    impactDuration: Infinity,
    getProjectileFragment: () => new Projectile(
    {
      getDisplayObject: () =>
      {
        const sprite = new PIXI.Sprite(PIXI.Texture.from(resources.snipeProjectile));
        sprite.height = 6;
        sprite.width = 32;
        sprite.filters = [projectileColorMatrixFilter];

        return sprite;
      },
      spawnPosition: offsetUserData.singleAttackOriginPoint,

      initialVelocity: params.width / 0.2 / projectileDuration,
    }),
    onImpact: (x, y) =>
    {
      if (!impactHasOccurred)
      {
        impactHasOccurred = true;

        params.abilityUseEffects.triggerAllEffects();

        emitters.forEach(emitter =>
        {
          emitter.p.x = x;
          emitter.p.y = y;

          emitter.emit("once");
        });
      }
    },
    animateImpact: (time) =>
    {
      params.renderer.render(particleBufferSprite, particleRenderTexture, true);
      params.renderer.render(particleContainer, particleRenderTexture, false);

      params.renderer.render(particleRenderSprite, particleBufferTexture, true);

      proton.update();
    },
  });

  projectileFragment.draw();
  projectileFragment.displayObject.visible = false;
  mainContainer.addChild(projectileFragment.displayObject);

  // ----------INIT PARTICLES
  const particleContainer = new PIXI.Container();

  const proton = new Proton();
  proton.addRenderer(new PixiRenderer(particleContainer));

  const particlesAmountScale = params.height / 600;

  const particleRenderTexture = PIXI.RenderTexture.create(
  {
    width: params.width,
    height: params.height,
  });
  const particleRenderSprite = new PIXI.Sprite(particleRenderTexture);
  mainContainer.addChild(particleRenderSprite);

  const particleBufferTexture = PIXI.RenderTexture.create(
  {
    width: params.width,
    height: params.height,
  });
  const particleBufferSprite = new PIXI.Sprite(particleBufferTexture);
  particleBufferSprite.alpha *= 0.9;

  const emitters =
  [
    {
      name: "white",
      color: 0xFFFFFF,
      amount: 275,
      size: 6,
    },
    {
      name: "colored",
      color: colors[type].getHex(),
      amount: 25,
      size: 4,
    },
  ].map(emitterData =>
  {
    const emitter = new Proton.BehaviourEmitter<PixiParticle>();
    emitter.rate = new Proton.Rate(emitterData.amount * particlesAmountScale, 0.02);

    const particleTexture = (() =>
    {
      const particleSize = emitterData.size;

      const gfx = new PIXI.Graphics();
      gfx.beginFill(emitterData.color);
      gfx.drawRect(
        particleSize / 2,
        particleSize / 2,
        particleSize,
        particleSize,
      );
      gfx.endFill();

      return generateTextureWithBounds(
        params.renderer,
        gfx,
        PIXI.settings.SCALE_MODE,
        1,
        new PIXI.Rectangle(0, 0, particleSize, particleSize),
      );
    })();

    emitter.addInitialize(new FunctionInitialize("createSprite", (particle) =>
    {
      particle.displayObject = new PIXI.Sprite(particleTexture);
    }));
    emitter.addInitialize(new Proton.Velocity(new Proton.Span(0.5, 5.0),
      new Proton.Span(270, 20, true), "polar"));
    const emitterArea =
    {
      width: Math.min(params.target.drawingFunctionData.boundingBox.width / 2, 20),
      height: Math.min(params.target.drawingFunctionData.boundingBox.height / 2, 20),
    };
    emitter.addInitialize(new Proton.Position(new Proton.RectZone(
      -emitterArea.width / 2,
      -emitterArea.height / 2,
      emitterArea.width,
      emitterArea.height,
    )));
    emitter.addInitialize(new Proton.Life(new Proton.Span(
      params.duration * (1.0 - impactTime) / 3000,
      params.duration * (1.0 - impactTime) / 1500,
    )));

    emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0));

    proton.addEmitter(emitter);

    return emitter;
  });


  // ----------ANIMATE

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const time = elapsedTime / params.duration;

    beamFragment.animate(time);

    if (time >= projectileLaunchTime)
    {
      projectileFragment.displayObject.visible = true;

      const projectileTime = getRelativeValue(time, projectileLaunchTime, 1);
      projectileFragment.animate(projectileTime);
    }

    params.renderer.render(mainContainer, renderTexture, true);

    if (elapsedTime < params.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(renderedSprite);
  const startTime = Date.now();
  animate();
}
