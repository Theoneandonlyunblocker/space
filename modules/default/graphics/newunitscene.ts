/// <reference path="../../../lib/pixi.d.ts"/>
/// <reference path="../../../src/templateinterfaces/iunitdrawingfunction.d.ts"/>
/// <reference path="../../../src/templateinterfaces/sfxparams.d.ts"/>

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export var newUnitScene: Rance.Templates.IUnitDrawingFunction = function(
        unit: Unit,
        SFXParams: Rance.Templates.SFXParams
      )
      {
        // TODO battle scene

        var spriteTemplate = unit.template.sprite;
        var texture = PIXI.Texture.fromFrame(spriteTemplate.imageSrc);
        var sprite = new PIXI.Sprite(texture);

        SFXParams.triggerStart(sprite);

        return sprite;
      }
    }
  }
}
