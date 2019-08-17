import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import { VfxParams } from "../../../../src/templateinterfaces/VfxParams";
import { solveAcceleration } from "../../../../src/kinematics";
import { extractImageData } from "../../../../src/pixiWrapperFunctions";

import { ParticleBurst } from "../../../space/battlevfx/drawingfunctions/vfxfragments/ParticleBurst";
import { ArcZone } from "../../../space/battlevfx/drawingfunctions/proton/ArcZone";
import { CollisionRectZone } from "../../../space/battlevfx/drawingfunctions/proton/CollisionRectZone";
import { AbsorbParticles } from "../../../space/battlevfx/drawingfunctions/vfxfragments/AbsorbParticles";
import { Color } from "../../../../src/Color";
import { Point } from "../../../../src/Point";


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

export function mergeRelease(props: VfxParams): void
{
  lastUsedImageZone = null;

  const offsetTargetData = props.target.drawingFunctionData.normalizeForBattleVfx(
    props.targetOffset, props.width, "target");

  const container = new PIXI.Container();
  if (!props.facingRight)
  {
    container.x = props.width;
    container.scale.x = -1;
  }


  const bbox = offsetTargetData.boundingBox;

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
  offsetTargetData.individualUnitDisplayObjects.forEach(displayObject =>
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
    cancelAnimationFrame(animationHandle);
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
      animationHandle = requestAnimationFrame(animate);
    }

    if (!hasEnded && elapsedTime > fallbackAnimationStopTime)
    {
      end();
    }
  }

  props.triggerStart(container);
  props.triggerEffect();
  const startTime = Date.now();

  animationHandle = requestAnimationFrame(animate);
}

export function mergeAbsorb(props: VfxParams): void
{
  const offsetTargetData = props.target.drawingFunctionData.normalizeForBattleVfx(
    props.targetOffset, props.width, "target");

  const container = new PIXI.Container();
  if (!props.facingRight)
  {
    container.x = props.width;
    container.scale.x = -1;
  }


  const origin =
  {
    x: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
    y: offsetTargetData.boundingBox.y + offsetTargetData.boundingBox.height / 2,
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
      offsetTargetData.boundingBox.width  * -0.25,
      offsetTargetData.boundingBox.height * -0.25,
      offsetTargetData.boundingBox.width  * 0.25,
      offsetTargetData.boundingBox.height * 0.25,
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
    cancelAnimationFrame(animationHandle);
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
      animationHandle = requestAnimationFrame(animate);
    }

    if (!hasEnded && elapsedTime > fallbackAnimationStopTime)
    {
      end();
    }
  }

  props.triggerStart(container);
  props.triggerEffect();
  const startTime = Date.now();

  animationHandle = requestAnimationFrame(animate);
}
