import * as PIXI from "pixi.js";

import {Point} from "./Point";

export const dummyShaderTexture = (() =>
{
  const canvas = document.createElement("canvas");
  (<HTMLCanvasElement & {_pixiId: string}> canvas)._pixiId = "dummyShaderTexture";
  canvas.width = 1;
  canvas.height = 1;

  return PIXI.Texture.from(canvas);
})();

// TODO 2019.07.31 | rename. not a sprite
export function makeShaderSprite<U>(shader: PIXI.Shader<U>): PIXI.Mesh
export function makeShaderSprite<U>(
  shader: PIXI.Shader<U>,
  x: number,
  y: number,
  width: number,
  height: number,
): PIXI.Mesh
export function makeShaderSprite<U>(
  shader: PIXI.Shader<U>,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
): PIXI.Mesh
{
  shader.uniforms["uSampler"] = dummyShaderTexture;

  const geometry = new PIXI.Quad;
  geometry.addAttribute("aTextureCoord", [0, 0, 1, 0, 1, 1, 0, 1], 2);
  geometry.addIndex([0, 1, 2, 0, 2, 3]);

  const mesh = new PIXI.Mesh(geometry, shader);

  if (isFinite(x))
  {
    mesh.position.set(x, y);

    mesh.width = width;
    mesh.height = height;
  }

  return mesh;
}
export function makeCenteredShaderSprite<U>(shader: PIXI.Shader<U>): PIXI.Mesh
{
  const mesh = makeShaderSprite(shader);
  mesh.geometry.addAttribute("aVertexPosition",
  [
    -0.5, -0.5,
     0.5, -0.5,
     0.5,  0.5,
    -0.5,  0.5,
  ]);

  return mesh;
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

function isSprite(displayObject: PIXI.DisplayObject): displayObject is PIXI.Sprite
{
  return displayObject.isSprite;
}
export function copyTransform(source: PIXI.DisplayObject, target: PIXI.DisplayObject): void
{
  target.setTransform(
    source.position.x,
    source.position.y,
    source.scale.x,
    source.scale.y,
    source.rotation,
    source.skew.x,
    source.skew.y,
    source.pivot.x,
    source.pivot.y,
  );

}
export function cloneMesh(mesh: PIXI.Mesh): PIXI.Mesh
{
  return new PIXI.Mesh(mesh.geometry, mesh.shader, mesh.state, mesh.drawMode);
}
export function cloneSprite(sprite: PIXI.Sprite): PIXI.Sprite
{
  return new PIXI.Sprite(sprite.texture);
}
export function cloneDisplayObject(displayObject: PIXI.Sprite | PIXI.Mesh | PIXI.Graphics): PIXI.Sprite | PIXI.Mesh | PIXI.Graphics
{
  if (isSprite(displayObject))
  {
    const cloned = cloneSprite(displayObject);
    copyTransform(displayObject, cloned);

    return cloned;
  }
  else if (displayObject instanceof PIXI.Mesh)
  {
    const cloned = cloneMesh(displayObject);
    copyTransform(displayObject, cloned);

    return cloned;
  }
  else if (displayObject instanceof PIXI.Graphics)
  {
    const cloned = displayObject.clone();
    copyTransform(displayObject, cloned);

    return cloned;
  }
  else
  {
    throw new Error();
  }
}
