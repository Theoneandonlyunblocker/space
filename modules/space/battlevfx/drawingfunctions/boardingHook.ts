import * as PIXI from "pixi.js";

import {VfxParams} from "../../../../src/templateinterfaces/VfxParams";
import { WavyLine } from "./vfxfragments/WavyLine";


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

  const ropeFragment = new WavyLine(
  {
    getTexture: () => PIXI.Texture.from("placeHolder"),
    originPoint: startPosition,
    endPositionX: impactX,
    timeScale: 2,
  });

  ropeFragment.draw();
  container.addChild(ropeFragment.displayObject);

  function animate(currentTime: number): void
  {
    const elapsedTime = currentTime - startTime;
    const relativeTime = elapsedTime / params.duration;

    if (elapsedTime < params.duration)
    {
      ropeFragment.animate(relativeTime);

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
