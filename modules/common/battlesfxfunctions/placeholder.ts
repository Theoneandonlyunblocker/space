/// <reference path="../../../lib/pixi.d.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

export function placeholder(params: SFXParams): void
{
  const container = new PIXI.Container();
  const sprite = PIXI.Sprite.fromImage("img/placeholder.png");
  sprite.anchor = new PIXI.Point(0.5, 0.5);
  sprite.x = params.width / 2;
  sprite.y = params.height / 2;
  container.addChild(sprite);

  const startTime = performance.now();
  const endTime = startTime + params.duration;

  function animate(currentTime: number): void
  {
    if (currentTime < endTime)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(container);
  animate(startTime);
}
