import app from "./App";


interface SpriteSheetFrame
{
  x: number;
  y: number;
  w: number;
  h: number;
}
interface SpriteSheetData
{
  frames:
  {
    [id: string]:
    {
      frame: SpriteSheetFrame;
    },
  };
  meta: any;
};

function addImageToApp(name: string, image: HTMLImageElement)
{
  app.images[name] = image;
}

function spriteSheetFrameToImage(sheetImg: HTMLImageElement, frame: SpriteSheetFrame): HTMLImageElement
{
  const canvas = <HTMLCanvasElement> document.createElement("canvas");
  canvas.width = frame.w;
  canvas.height = frame.h;
  const context = canvas.getContext("2d");

  if (!context)
  {
    throw new Error("Couldn't get canvas context");
  }

  context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

  const image = new Image();
  image.src = canvas.toDataURL();

  return image;
}

export default function cacheSpriteSheetAsImages(sheetData: SpriteSheetData, sheetImg: HTMLImageElement)
{
  for (const spriteName in sheetData.frames)
  {
    const frame = sheetData.frames[spriteName].frame;
    const image = spriteSheetFrameToImage(sheetImg, frame);

    addImageToApp(spriteName, image);
  }
}
