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
  export function cacheSpriteSheetImages(sheetData: ISpriteSheetData, sheetImg: HTMLImageElement)
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

      app.images[spriteName] = image;
    }

    processSpriteSheet(sheetData, sheetImg, spriteToImageFN);
  }
  export function cacheSpriteSheetTextures(sheetData: ISpriteSheetData, sheetImg: HTMLImageElement)
  {
    var spriteToTextureFN = function(sheetImg: HTMLImageElement, f: ISpriteSheetFrame)
    {
      var baseTexture = PIXI.BaseTexture.fromImage(sheetImg.src, false);

      var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(f.x, f.y, f.w, f.h));
    }

    processSpriteSheet(sheetData, sheetImg, spriteToTextureFN);
  }
}