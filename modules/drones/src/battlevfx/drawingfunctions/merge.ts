import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import { VfxDrawingFunction } from "core/src/templateinterfaces/VfxDrawingFunction";
import { solveAcceleration } from "core/src/math/kinematics";
import { extractImageData } from "core/src/graphics/pixiWrapperFunctions";

import { ParticleBurst } from "modules/baselib/src/combat/vfx/fragments/ParticleBurst";
import { ArcZone } from "modules/baselib/src/combat/vfx/proton/ArcZone";
import { CollisionRectZone } from "modules/baselib/src/combat/vfx/proton/CollisionRectZone";
import { AbsorbParticles } from "modules/baselib/src/combat/vfx/fragments/AbsorbParticles";
import { Color } from "core/src/color/Color";
import { Point } from "core/src/math/Point";


const baseParticleCount = 200;

let lastUsedImageZone: Proton.ImageZone;

function makeParticleDisplayObject(imageZone: Proton.ImageZone, positionToSample: Point): PIXI.DisplayObject
{
  const eightBitColor = imageZone.getColor(positionToSample.x, positionToSample.y);
  const color = Color.from8BitRgb(eightBitColor.r, eightBitColor.g, eightBitColor.b);

  const graphics = new PIXI.Graphics();
  graphics.lineStyle(0);
  graphics.beginFill(color.getHex(), eightBitColor.a);
  graphics.drawRect(-2, -2, 4, 4);
  graphics.endFill();

  return graphics;
}

export const mergeRelease: VfxDrawingFunction = props =>
{
  lastUsedImageZone = null;

  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(
    props.userOffset, props.width, "user");

  const container = new PIXI.Container();
  if (!props.facingRight)
  {
    container.x = props.width;
    container.scale.x = -1;
  }


  const bbox = offsetUserData.boundingBox;

  const origin =
  {
    x: bbox.x,
    y: bbox.y,
  };
  const centerOrigin =
  {
    x: origin.x + bbox.width / 2,
    y: origin.y + bbox.height / 2,
  };

  const maxParticleExtent = ArcZone.getDistanceToFurthestPointOnCanvas(
    centerOrigin,
    props.width,
    props.height,
    0,
    360,
  );

  const particleCount = baseParticleCount;
  const velocityForSecond = 0;
  const velocity = velocityForSecond / (props.duration / 1000);
  const acceleration = solveAcceleration(
  {
    duration: props.duration / 1000,
    initialVelocity: velocity,
    displacement: maxParticleExtent,
  });

  const spritesContainer = new PIXI.Container();
  offsetUserData.individualUnitDisplayObjects.forEach(displayObject =>
  {
    spritesContainer.addChild(displayObject);
  });

  const imageData = extractImageData(
    spritesContainer,
    props.renderer.plugins.extract,
  );
  const imageZone = new Proton.ImageZone(imageData);
  lastUsedImageZone = imageZone;

  const dissipateFragment = new ParticleBurst(
  {
    particleCount: particleCount,
    velocity: velocity,
    acceleration: acceleration,
    forceOrigin:
    {
      x: bbox.width / 2,
      y: bbox.height / 2,
    },
    getParticleDisplayObject: particle =>
    {
      return makeParticleDisplayObject(imageZone, particle.p);
    },
    getEmitZone: () => imageZone,

    getKillZone: () => new Proton.RectZone(
      -origin.x,
      -origin.y,
      props.width,
      props.height,
    ),
    onEnd: end,
  });

  dissipateFragment.draw();
  container.addChild(dissipateFragment.displayObject);

  dissipateFragment.position.set(origin.x, origin.y);


  const fallbackAnimationStopTime = props.duration * 1.5;
  let animationHandle: number;
  let hasEnded: boolean = false;

  function end()
  {
    hasEnded = true;
    window.cancelAnimationFrame(animationHandle);
    container.removeChildren();

    props.triggerEnd();
  }

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / props.duration;

    dissipateFragment.animate(relativeTime);

    if (!hasEnded)
    {
      animationHandle = window.requestAnimationFrame(animate);
    }

    if (!hasEnded && elapsedTime > fallbackAnimationStopTime)
    {
      end();
    }
  }

  props.triggerStart(container);
  props.abilityUseEffects.triggerAllEffects();
  const startTime = Date.now();

  animationHandle = window.requestAnimationFrame(animate);
};

export const mergeAbsorb: VfxDrawingFunction = props =>
{
  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(
    props.userOffset, props.width, "user");

  const container = new PIXI.Container();
  if (!props.facingRight)
  {
    container.x = props.width;
    container.scale.x = -1;
  }


  const origin =
  {
    x: offsetUserData.boundingBox.x + offsetUserData.boundingBox.width / 2,
    y: offsetUserData.boundingBox.y + offsetUserData.boundingBox.height / 2,
  };
  const emitZoneAngle = 360;
  const emitZoneHeading = 0;
  const emitZonePadding = 0;
  const emitZoneWidth = 50;
  const particleCount = baseParticleCount;

  const emitZoneStart = ArcZone.getDistanceToFurthestPointOnCanvas(
    origin,
    props.width,
    props.height,
    emitZoneHeading,
    emitZoneAngle,
  ) + emitZonePadding;
  const emitZoneEnd = emitZoneStart + emitZoneWidth;

  const emitZone = new ArcZone(
    0,
    0,
    emitZoneHeading,
    emitZoneAngle,
    emitZoneEnd,
    emitZoneStart,
  );

  const velocity = 0;
  const acceleration = solveAcceleration(
  {
    initialVelocity: velocity,
    duration: props.duration / 1000,
    displacement: emitZoneEnd,
  });

  const absorbFragment = new AbsorbParticles(
  {
    particleCount: particleCount,
    velocity: velocity,
    acceleration: acceleration,
    getParticleDisplayObject: particle =>
    {
      const positionToSample = lastUsedImageZone.getPosition();

      return makeParticleDisplayObject(lastUsedImageZone, positionToSample);
    },
    getEmitZone: () => emitZone,

    getKillZone: () => new CollisionRectZone(
      offsetUserData.boundingBox.width  * -0.25,
      offsetUserData.boundingBox.height * -0.25,
      offsetUserData.boundingBox.width  * 0.25,
      offsetUserData.boundingBox.height * 0.25,
    ),
    onEnd: end,
  });

  absorbFragment.draw();
  container.addChild(absorbFragment.displayObject);

  absorbFragment.position.set(origin.x, origin.y);


  const fallbackAnimationStopTime = props.duration * 1.5;
  let animationHandle: number;
  let hasEnded: boolean = false;

  function end()
  {
    hasEnded = true;
    window.cancelAnimationFrame(animationHandle);
    container.removeChildren();

    props.triggerEnd();
  }

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / props.duration;

    absorbFragment.animate(relativeTime);

    if (!hasEnded)
    {
      animationHandle = window.requestAnimationFrame(animate);
    }

    if (!hasEnded && elapsedTime > fallbackAnimationStopTime)
    {
      end();
    }
  }

  props.triggerStart(container);
  props.abilityUseEffects.triggerAllEffects();
  const startTime = Date.now();

  animationHandle = window.requestAnimationFrame(animate);
};
