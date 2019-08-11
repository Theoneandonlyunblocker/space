import * as PIXI from "pixi.js";

import {TilingRope} from "../../../../src/pixiWrapperFunctions";
import {VfxParams} from "../../../../src/templateinterfaces/VfxParams";


export function boardingHook(params: VfxParams)
{
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleVfx(
    params.targetOffset, params.width, "target");
  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleVfx(
    params.userOffset, params.width, "user");

  const container = new PIXI.Container();
  if (!params.facingRight)
  {
    container.x = params.width;
    container.scale.x = -1;
  }


  const startPosition = offsetUserData.singleAttackOriginPoint;
  const impactX = offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2;

  const ropeTexture = PIXI.Texture.from("placeHolder");
  const ropeLength = impactX - startPosition.x;
  const ropeSegmentsCount = 20;
  const ropeSegmentsMaxIndex = ropeSegmentsCount - 1;
  const ropeMaxSway = 10;
  const ropeSwayTimeScale = 5;
  const ropePoints: PIXI.Point[] = [];
  for (let i = 0; i < ropeSegmentsCount; i++)
  {
    ropePoints.push(new PIXI.Point(startPosition.x, startPosition.y));
  }

  const rope = new TilingRope(ropeTexture, ropePoints, ropeLength / 2);
  container.addChild(rope);

  function animate(currentTime: number): void
  {
    const elapsedTime = currentTime - startTime;
    const relativeTime = elapsedTime / params.duration;

    if (elapsedTime < params.duration)
    {
      ropePoints.forEach((point, i) =>
      {
        const yFromSway = Math.sin((i * 0.5) + relativeTime * ropeSwayTimeScale) * ropeMaxSway;

        const distanceFromCenter = Math.abs(i - ropeSegmentsMaxIndex / 2);
        const relativeDistanceFromCenter = distanceFromCenter / ropeSegmentsMaxIndex * 2;
        const closenessToCenter = 1 - relativeDistanceFromCenter;
        const swayFactor = closenessToCenter * relativeTime;

        point.x = startPosition.x + i * ropeLength / ropeSegmentsMaxIndex * relativeTime;
        point.y = startPosition.y + yFromSway * swayFactor;
      });

      requestAnimationFrame(animate);
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(container);

  const startTime = performance.now();
  animate(startTime);
}
