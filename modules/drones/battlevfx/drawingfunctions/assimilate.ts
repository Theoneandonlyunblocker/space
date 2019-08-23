import { VfxDrawingFunction } from "../../../../src/VfxDrawingFunction";
import { VfxParams } from "../../../../src/templateinterfaces/VfxParams";

import { AbsorbParticlesFromTarget } from "../../../space/battlevfx/drawingfunctions/vfxfragments/AbsorbParticlesFromTarget";
import { ResultType } from "../../../space/effectactions/ResultType";


export type EffectIds = "damage" | "increaseUserHealth";
export type EffectResults =
{
  [ResultType.HealthChanged]: number;
}

function getParticleCount(props: VfxParams<EffectIds, EffectResults>): number
{
  const damageDealt = props.abilityUseEffects ?
    -1 * props.abilityUseEffects.squashed.executedEffectsResult[ResultType.HealthChanged] :
    400;

  return Math.log(damageDealt) * 20;
}

export const assimilate: VfxDrawingFunction<EffectIds, EffectResults> = props =>
{
  const offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(
    props.userOffset, props.width, "user");
  const offsetTargetData = props.target.drawingFunctionData.normalizeForBattleVfx(
    props.targetOffset, props.width, "target");

  const container = new PIXI.Container();
  if (!props.facingRight)
  {
    container.x = props.width;
    container.scale.x = -1;
  }

  const asborbFragment = new AbsorbParticlesFromTarget(
  {
    getParticleDisplayObject: (particle, color) =>
    {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(color.getHex(), 1);
      graphics.drawRect(-2, -2, 4, 4);
      graphics.endFill();

      return graphics;
    },
    duration: props.duration,
    onEnd: end,
    particleCount: getParticleCount(props),
  });

  asborbFragment.draw(offsetUserData, offsetTargetData, props.renderer);
  container.addChild(asborbFragment.displayObject);

  let animationHandle: number;
  let hasEnded: boolean = false;
  function end()
  {
    hasEnded = true;
    cancelAnimationFrame(animationHandle);
    container.removeChildren();

    props.triggerEnd();
  }

  const fallbackAnimationStopTime = props.duration * 1.5;

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / props.duration;

    asborbFragment.animate(relativeTime);

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
  // TODO 2019.08.23 | trigger increaseUserHealth when first particle is absorbed
  props.abilityUseEffects.triggerAllEffectsBut("increaseUserHealth");
  const startTime = Date.now();

  animationHandle = requestAnimationFrame(animate);
}
