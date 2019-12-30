import * as PIXI from "pixi.js";

import {UnitDrawingFunction} from "core/src/templateinterfaces/UnitDrawingFunction";

import {Unit} from "core/src/unit/Unit";
import {VfxParams} from "core/src/templateinterfaces/VfxParams";
import { generatePlaceholderTextureForVfx } from "./generatePlaceholderTextureForVfx";
import { UnitSpriteData } from "./UnitSpriteData";
import { UnitDrawingFunctionData } from "core/src/unit/UnitDrawingFunctionData";


export function makeSingleUnitDrawingFunction(spriteData: UnitSpriteData, getImageSrc: () => string): UnitDrawingFunction
{
  return (unit: Unit, vfxParams: VfxParams) =>
  {
    const texture = PIXI.Texture.from(getImageSrc());

    return singleUnitDrawingFunction(spriteData, texture, vfxParams);
  };
}
export function makeSingleUnitDrawingFunctionForPlaceholder(spriteData: UnitSpriteData, placeholderText: string): UnitDrawingFunction
{
  return (unit: Unit, vfxParams: VfxParams) =>
  {
    const texture = generatePlaceholderTextureForVfx(vfxParams, placeholderText);

    return singleUnitDrawingFunction(spriteData, texture, vfxParams);
  };
}

function singleUnitDrawingFunction(
  spriteData: UnitSpriteData,
  texture: PIXI.Texture,
  vfxParams: VfxParams,
): UnitDrawingFunctionData
{
  const container = new PIXI.Container();

  const x = 0;
  const y = vfxParams.height / 2 - texture.height / 2;

  const sprite = new PIXI.Sprite(texture);
  container.addChild(sprite);
  sprite.position.set(x, y);

  const boundingBox = new PIXI.Rectangle(
    x,
    y,
    texture.width,
    texture.height,
  );

  const attackOriginPoint =
  {
    x: x + texture.width * spriteData.attackOriginPoint.x,
    y: y + texture.height * spriteData.attackOriginPoint.y,
  };

  vfxParams.triggerStart(container);

  return new UnitDrawingFunctionData(
  {
    boundingBox: boundingBox,
    individualUnitBoundingBoxes: [boundingBox],
    singleAttackOriginPoint: attackOriginPoint,
    sequentialAttackOriginPoints: [attackOriginPoint],
    individualUnitDisplayObjects: [sprite],
  });
}
