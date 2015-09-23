/// <reference path="../lib/rng.d.ts" />
/// <reference path="templateinterfaces/isubemblemtemplate.d.ts" />

/// <reference path="color.ts"/>

module Rance
{
  export class Emblem
  {
    alpha: number;
    color: number;
    inner: Templates.ISubEmblemTemplate;
    outer: Templates.ISubEmblemTemplate;
    constructor(color: number, alpha?: number,
      inner?: Templates.ISubEmblemTemplate, outer?: Templates.ISubEmblemTemplate)
    {
      this.color = color;
      this.alpha = isFinite(alpha) ? alpha : 1;
      this.inner = inner;
      this.outer = outer;
    }

    isForegroundOnly(): boolean
    {
      if (this.inner.foregroundOnly) return true;
      if (this.outer && this.outer.foregroundOnly) return true;

      return false;
    }
    generateRandom(minAlpha: number, rng?: any): void
    {
      var rng: any = rng || new RNG(Math.random);
      this.alpha = rng.uniform();
      this.alpha = clamp(this.alpha, minAlpha, 1);

      this.generateSubEmblems(rng);
    }
    generateSubEmblems(rng: any): void
    {
      var allEmblems: Templates.ISubEmblemTemplate[] = [];

      function getSeededRandomArrayItem(array: any[])
      {
        var _rnd = Math.floor(rng.uniform() * array.length);
        return array[_rnd];
      }

      for (var subEmblem in app.moduleData.Templates.SubEmblems)
      {
        allEmblems.push(app.moduleData.Templates.SubEmblems[subEmblem]);
      }

      var mainEmblem = getSeededRandomArrayItem(allEmblems);

      if (mainEmblem.position === "both")
      {
        this.inner = mainEmblem;
        return;
      }
      else if (mainEmblem.position === "inner" || mainEmblem.position === "outer")
      {
        this[mainEmblem.position] = mainEmblem;
      }
      else // inner-or-both || outer-or-both
      {
        if (rng.uniform() > 0.5)
        {
          this.inner = mainEmblem;
          return;
        }
        else if (mainEmblem.position === "inner-or-both")
        {
          this.inner = mainEmblem;
        }
        else
        {
          this.outer = mainEmblem;
        }
      }


      if (mainEmblem.position === "inner" || mainEmblem.position === "inner-or-both")
      {
        var subEmblem = getSeededRandomArrayItem(allEmblems.filter(function(emblem)
        {
          return (emblem.position === "outer" || emblem.position === "outer-or-both");
        }));

        this.outer = subEmblem;
      }
      else if (mainEmblem.position === "outer" || mainEmblem.position === "outer-or-both")
      {
        var subEmblem = getSeededRandomArrayItem(allEmblems.filter(function(emblem)
        {
          return (emblem.position === "inner" || emblem.position === "inner-or-both");
        }));

        this.inner = subEmblem;
      }
    }
    draw()
    {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      ctx.globalAlpha = this.alpha;

      var inner = this.drawSubEmblem(this.inner);
      canvas.width = inner.width;
      canvas.height = inner.height;
      ctx.drawImage(inner, 0, 0);

      if (this.outer)
      {
        var outer = this.drawSubEmblem(this.outer);
        ctx.drawImage(outer, 0, 0);
      }

      return canvas;
    }

    drawSubEmblem(toDraw: Templates.ISubEmblemTemplate)
    {
      var image = app.images[toDraw.imageSrc];


      var width = image.width;
      var height = image.height;

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0);

      ctx.globalCompositeOperation = "source-in";

      ctx.fillStyle = "#" + hexToString(this.color);
      ctx.fillRect(0, 0, width, height);

      return canvas;
    }

    serialize()
    {
      var data: any =
      {
        alpha: this.alpha,
        innerType: this.inner.type
      };

      if (this.outer) data.outerType = this.outer.type;

      return(data);
    }
  }
}
