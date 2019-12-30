import * as PIXI from "pixi.js";
import { VfxParams } from "core/src/templateinterfaces/VfxParams";


export function generatePlaceholderTextureForVfx(vfxParams: VfxParams, placeholderText: string): PIXI.Texture
{
  const text = new PIXI.Text(placeholderText,
  {
    fontSize: 20,
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeThickness: 3,
  });

  const wrappingContainer = new PIXI.Container();
  wrappingContainer.addChild(text);

  if (!vfxParams.facingRight)
  {
    text.scale.x *= -1;
  }

  return vfxParams.renderer.generateTexture(
    wrappingContainer,
    PIXI.settings.SCALE_MODE,
    1,
  );
}
