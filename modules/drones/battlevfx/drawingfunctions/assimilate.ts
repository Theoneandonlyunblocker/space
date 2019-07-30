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
    getParticleDisplayObject: () =>
    {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(0xDE3249, 1);
      graphics.drawCircle(-1, -1, 2);
      graphics.endFill();

      return graphics;
    },
    duration: props.duration,
    onEnd: end,
  });

  asborbFragment.draw(offsetUserData, offsetTargetData);
  container.addChild(asborbFragment.displayObject);

  let animationHandle: number;
  function end()
  {
    cancelAnimationFrame(animationHandle);

    props.triggerEnd();
  }

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / props.duration;

    asborbFragment.animate(relativeTime);

    animationHandle = requestAnimationFrame(animate);
  }

  props.triggerStart(container);
  const startTime = Date.now();

  animate();
}
