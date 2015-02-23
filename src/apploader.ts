/// <reference path="../lib/pixi.d.ts" />

module Rance
{
  export interface ISpritesheetData
  {
    frames:
    {
      [id: string]:
      {
        frame: {x: number; y: number; w: number; h: number;}
      }
    };
    meta: any;
  }
  
  export class AppLoader
  {
    loaded =
    {
      DOM: false,
      emblems: false,
      other: false
    };
    startTime: number;
    onLoaded: any;
    imageCache:
    {
      [type: string]:
      {
        [id: string]: HTMLImageElement;
      }
    } = {};

    constructor(onLoaded: any)
    {
      this.onLoaded = onLoaded;
      PIXI.dontSayHello = true;
      this.startTime = new Date().getTime();

      this.loadDOM();
      this.loadEmblems();
      this.loadOther();
    }
    spritesheetToDataURLs(sheetData: ISpritesheetData, sheetImg: HTMLImageElement)
    {
      var self = this;
      var frames: {[id: string]: HTMLImageElement;} = {};

      (function splitSpritesheetFN()
      {
        for (var sprite in sheetData.frames)
        {
          var frame = sheetData.frames[sprite].frame;

          var canvas = <HTMLCanvasElement> document.createElement("canvas");
          canvas.width = frame.w;
          canvas.height = frame.h;
          var context = canvas.getContext("2d");

          context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h,
            0, 0, frame.w, frame.h);

          var image = new Image();
          image.src = canvas.toDataURL();

          frames[sprite] = image;
        }
      }());

      return frames;
    }
    loadDOM()
    {
      var self = this;
      if (document.readyState === "interactive" || document.readyState === "complete")
      {
        self.loaded.DOM = true;
        self.checkLoaded();
      }
      else
      {
        document.addEventListener('DOMContentLoaded', function()
        {
          self.loaded.DOM = true;
          self.checkLoaded();
        });
      }
    }
    loadImagesFN(identifier: string)
    {
      if (this.loaded[identifier] === undefined) this.loaded[identifier] = false;

      var self = this;
      var loader = new PIXI.JsonLoader("img\/" + identifier + ".json");
      loader.addEventListener("loaded", function(event)
      {
        var spriteImages = self.spritesheetToDataURLs(event.target.json,
          event.target.texture.source);
        self.imageCache[identifier] = spriteImages;
        self.loaded[identifier] = true;
        self.checkLoaded();
      });

      loader.load();
    }
    loadOther()
    {
      var self = this;
      var loader = new PIXI.ImageLoader("img\/fowTexture.png");

      loader.addEventListener("loaded", function(event)
      {
        self.loaded.other = true;
        self.checkLoaded();
      });

      loader.load();
    }
    checkLoaded()
    {
      for (var prop in this.loaded)
      {
        if (!this.loaded[prop])
        {
          return;
        }
      }
      var elapsed = new Date().getTime() - this.startTime;
      console.log("Loaded in " + elapsed + " ms");
      this.onLoaded.call();
    }
  }
}