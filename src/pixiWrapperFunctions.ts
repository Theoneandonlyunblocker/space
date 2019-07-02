import * as PIXI from "pixi.js";

import Point from "./Point";


export function createDummySpriteForShader(x?: number, y?: number, width?: number, height?: number)
{
  const texture = getDummyTextureForShader();

  const sprite = new PIXI.Sprite(texture);
  if (x || y)
  {
    sprite.position = new PIXI.Point(x || 0, y || 0);
  }
  if (width)
  {
    sprite.width = width;
  }
  if (height)
  {
    sprite.height = height;
  }

  return sprite;
}
export function getDummyTextureForShader()
{
  const canvas = document.createElement("canvas");
  // pixi will reuse basetexture with this set
  (<HTMLCanvasElement & {_pixiId: string}> canvas)._pixiId = "dummyShaderTexture";
  canvas.width = 1;
  canvas.height = 1;

  return PIXI.Texture.from(canvas);
}
export function makeShaderSprite(
  shader: PIXI.Filter<any>,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
): PIXI.Sprite
{
  const sprite = createDummySpriteForShader(x, y, width, height);

  attachShaderToSprite(sprite, shader);

  return sprite;
}
export function attachShaderToSprite(
  sprite: PIXI.Sprite,
  shader: PIXI.Filter<any>
)
{
  // sprite.shader = shader;
  // TODO 2017.07.24 | really just a temporary workaround
  sprite.filters = [shader];
  sprite.filterArea = sprite.getBounds();
}
export function convertClientRectToPixiRect(rect: ClientRect): PIXI.Rectangle
{
  return new PIXI.Rectangle(
    rect.left,
    rect.top,
    rect.width,
    rect.height,
  );
}
export function generateTextureWithBounds(
  renderer: PIXI.Renderer,
  displayObject: PIXI.DisplayObject,
  scaleMode: number,
  resolution: number,
  customBounds: PIXI.Rectangle,
): PIXI.Texture
{
  const bounds = customBounds;

  const renderTexture = PIXI.RenderTexture.create(
  {
    width: bounds.width || 0,
    height: bounds.height || 0,
    scaleMode: scaleMode,
    resolution: resolution,
  });

  const tempMatrix = new PIXI.Matrix();
  tempMatrix.tx = -bounds.x;
  tempMatrix.ty = -bounds.y;

  renderer.render(displayObject, renderTexture, false, tempMatrix, true);

  return renderTexture;

}
export function makePolygonFromPoints(
  points: Point[],
): PIXI.Polygon
{
  const pointPositions: number[] = [];
  points.forEach(point =>
  {
    pointPositions.push(point.x, point.y);
  });

  return new PIXI.Polygon(pointPositions);
}
