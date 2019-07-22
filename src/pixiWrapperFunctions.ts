import * as PIXI from "pixi.js";

import {Point} from "./Point";


// export function getDummyTextureForShader()
// {
//   const canvas = document.createElement("canvas");
//   // pixi will reuse basetexture with this set
//   (<HTMLCanvasElement & {_pixiId: string}> canvas)._pixiId = "dummyShaderTexture";
//   canvas.width = 1;
//   canvas.height = 1;

//   return PIXI.Texture.from(canvas);
// }
export function makeShaderSprite<U>(
  shader: PIXI.Shader<U>,
  x: number,
  y: number,
  width: number,
  height: number,
): PIXI.Mesh
{

  const geometry = new PIXI.Quad();
  geometry.addAttribute("aTextureCoord", [0, 0, 1, 0, 1, 1, 0, 1], 2);
  geometry.addIndex([0, 1, 2, 0, 2, 3]);

  const mesh = new PIXI.Mesh(geometry, shader);

  mesh.position.set(x, y);
  mesh.width = width;
  mesh.height = height;

  return mesh;
}
// TODO 2019.07.22 | probably can be removed
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

  renderer.render(displayObject, renderTexture, false, tempMatrix, false);

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
