import * as PIXI from "pixi.js";

import {SfxParams} from "../../../../src/templateinterfaces/SfxParams";


export function placeholder(params: SfxParams): void
{
  const container = new PIXI.Container();
  const sprite = PIXI.Sprite.from("img/placeholder.png");
  sprite.anchor.set(0.5, 0.5);
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
