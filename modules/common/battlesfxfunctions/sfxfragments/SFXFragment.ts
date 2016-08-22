/// <reference path="../../../../lib/pixi.d.ts" />

interface SFXFragment
{
  displayObject: PIXI.DisplayObject;

  animate(relativeTime: number): void;
}

export default SFXFragment;
