import * as PIXI from "pixi.js";

import {VfxParams} from "core/templateinterfaces/VfxParams";
import {BattleVfxTemplate} from "core/templateinterfaces/BattleVfxTemplate";


export function makePlaceholderVfx(abilityName: string): BattleVfxTemplate
{
  return(
  {
    duration: 1000,
    battleOverlay: placeholderDrawingFunction.bind(null, abilityName),
    vfxWillTriggerEffect: false,
  });
}


function placeholderDrawingFunction(abilityName: string, params: VfxParams): void
{
  const container = new PIXI.Container();
  const text = new PIXI.Text(abilityName,
  {
    fontSize: 32,
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeThickness: 3,
  });
  text.anchor.set(0.5, 0.5);
  text.x = params.width / 2;
  text.y = params.height / 2;
  container.addChild(text);

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
