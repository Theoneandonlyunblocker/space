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

function processSpriteSheet(sheetData: SpriteSheetData, sheetImg: HTMLImageElement,
  processFrameFN: (sheetImg: HTMLImageElement, frame: SpriteSheetFrame, spriteName?: string) => void)
{
  for (const spriteName in sheetData.frames)
  {
    processFrameFN(sheetImg, sheetData.frames[spriteName].frame, spriteName);
  }
}

function addImageToApp(name: string, image: HTMLImageElement)
{
  app.images[name] = image;
}

export default function cacheSpriteSheetAsImages(sheetData: SpriteSheetData, sheetImg: HTMLImageElement,
  onImageCreated: (name: string, image: HTMLImageElement) => void = addImageToApp)
{
  const spriteToImageFN = function(sheetImg: HTMLImageElement, frame: SpriteSheetFrame, spriteName: string)
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

    // this is never true as pixi loader silently ignores duplicates, which is a shame
    // if (app.images[spriteName])
    // {
    //   throw new Error("Duplicate image name " + spriteName);
    //   return;
    // }
    onImageCreated(spriteName, image);
  };

  processSpriteSheet(sheetData, sheetImg, spriteToImageFN);
}
