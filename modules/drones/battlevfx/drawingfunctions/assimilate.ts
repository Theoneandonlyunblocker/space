import { VfxParams } from "../../../../src/templateinterfaces/VfxParams";

import { Absorb } from "../../../space/battlevfx/drawingfunctions/vfxfragments/Absorb";

export function assimilate(props: VfxParams)
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

  const asborbFragment = new Absorb(
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
  });

  asborbFragment.draw(offsetUserData, offsetTargetData, props.renderer);
  container.addChild(asborbFragment.displayObject);

  let animationHandle: number;
  let hasEnded: boolean = false;
  function end()
  {
    hasEnded = true;
    cancelAnimationFrame(animationHandle);

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
  props.triggerEffect();
  const startTime = Date.now();

  animationHandle = requestAnimationFrame(animate);
}
