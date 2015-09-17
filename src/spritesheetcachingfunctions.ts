module Rance
{
  export interface ISpriteSheetFrame
  {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  export interface ISpriteSheetData
  {
    frames:
    {
      [id: string]:
      {
        frame: ISpriteSheetFrame;
      }
    };
    meta: any;
  };

  function processSpriteSheet(sheetData: ISpriteSheetData, sheetImg: HTMLImageElement,
    processFrameFN: (sheetImg: HTMLImageElement, frame: ISpriteSheetFrame, spriteName?: string) => void)
  {
    for (var spriteName in sheetData.frames)
    {
      processFrameFN(sheetImg, sheetData.frames[spriteName].frame, spriteName);
    }
  }
  export function cacheSpriteSheetAsImages(sheetData: ISpriteSheetData, sheetImg: HTMLImageElement)
  {
    var spriteToImageFN = function(sheetImg: HTMLImageElement, frame: ISpriteSheetFrame, spriteName: string)
    {
      var canvas = <HTMLCanvasElement> document.createElement("canvas");
      canvas.width = frame.w;
      canvas.height = frame.h;
      var context = canvas.getContext("2d");

      context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

      var image = new Image();
      image.src = canvas.toDataURL();

      // this is never true as pixi loader silently ignores duplicates, which is a shame
      // if (app.images[spriteName])
      // {
      //   throw new Error("Duplicate image name " + spriteName);
      //   return;
      // }
      app.images[spriteName] = image;
    }

    processSpriteSheet(sheetData, sheetImg, spriteToImageFN);
  }
}