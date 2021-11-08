import { VfxDrawingFunction } from "core/src/templateinterfaces/VfxDrawingFunction";
import { VfxParams } from "core/src/templateinterfaces/VfxParams";

import { AbsorbParticlesFromTarget } from "modules/baselib/src/combat/vfx/fragments/AbsorbParticlesFromTarget";


function getParticleCount(props: VfxParams): number
{
  // TODO 2020.02.24 | hook up particle count to new combat system somehow
  const damageDealt = 400;

  return Math.log(damageDealt) * 20;
}

export const assimilate: VfxDrawingFunction = props =>
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
    onFirstParticleImpact: () =>
    {
      props.abilityUseEffects.triggerRemainingEffects();
    },
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
    window.cancelAnimationFrame(animationHandle);
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
      animationHandle = window.requestAnimationFrame(animate);
    }

    if (!hasEnded && elapsedTime > fallbackAnimationStopTime)
    {
      end();
    }
  }

  props.triggerStart(container);
  props.abilityUseEffects.triggerEffectsUntil("increaseUserHealth");
  const startTime = Date.now();

  animationHandle = window.requestAnimationFrame(animate);
};
