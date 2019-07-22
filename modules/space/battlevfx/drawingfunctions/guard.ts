import {VfxParams} from "../../../../src/templateinterfaces/VfxParams";
import { makeShaderSprite } from "../../../../src/pixiWrapperFunctions";
import
{
  getRelativeValue,
} from "../../../../src/utility";

import {Guard as GuardFilter} from "./shaders/Guard";


export function guard(props: VfxParams)
{
  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(
    props.userOffset, props.width, "user");
  const userX2 = offsetUserData.boundingBox.x + offsetUserData.boundingBox.width;
  const maxFrontier = Math.min(userX2 + 75, props.width / 2.2);
  const baseTrailDistance = 80;
  const maxTrailDistance = maxFrontier;
  const trailDistanceGrowth = maxTrailDistance - baseTrailDistance;
  const maxBlockWidth = maxFrontier * 2;

  const guardFilter = new GuardFilter(
  {
    frontier: 0,
    trailDistance: baseTrailDistance,
    seed: Math.random() * 420,
    blockSize: 90,
    blockWidth: 0,
    lineAlpha: 1.5,
    blockAlpha: 0,
  });

  const travelTime = 0.3;
  let hasTriggeredEffect = false;

  const syncUniformsFN = (time: number) =>
  {
    if (time < travelTime)
    {
      const adjustedtime = time / travelTime;
      guardFilter.setUniforms(
      {
        frontier: maxFrontier * adjustedtime,
      });
    }
    else
    {
      if (props.triggerEffect && !hasTriggeredEffect)
      {
        hasTriggeredEffect = true;
        props.triggerEffect();
      }
      const relativeTime = getRelativeValue(time, travelTime - 0.02, 1);
      const adjustedtime = Math.pow(relativeTime, 4);
      const relativeDistance = getRelativeValue(Math.abs(0.2 - adjustedtime), 0, 0.8);

      guardFilter.setUniforms(
      {
        trailDistance: baseTrailDistance + trailDistanceGrowth * adjustedtime,
        blockWidth: adjustedtime * maxBlockWidth,
        lineAlpha: (1 - adjustedtime) * 1.5,
        blockAlpha: 1 - relativeDistance,
      });
    }
  };

  const mesh = makeShaderSprite(
    guardFilter,
    0,
    0,
    maxFrontier + 20,
    props.height,
  );

  const renderTexture = PIXI.RenderTexture.create(
  {
    width: props.width,
    height: props.height,
  });
  const sprite = new PIXI.Sprite(renderTexture);
  if (!props.facingRight)
  {
    sprite.x = props.width;
    sprite.scale.x = -1;
  }

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / props.duration;
    syncUniformsFN(relativeTime);

    props.renderer.render(mesh, renderTexture, true);

    if (elapsedTime < props.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      props.triggerEnd();
    }
  }

  props.triggerStart(sprite);

  const startTime = Date.now();
  animate();
}
