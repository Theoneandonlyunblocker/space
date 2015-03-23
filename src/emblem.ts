/// <reference path="../lib/rng.d.ts" />
/// <reference path="../data/templates/subemblemtemplates.ts" />

/// <reference path="color.ts"/>

module Rance
{
  export class Emblem
  {
    alpha: number;
    color: number;
    inner: Templates.ISubEmblemTemplate;
    outer: Templates.ISubEmblemTemplate;
    constructor(color: number)
    {
      this.color = color;
    }

    isForegroundOnly()
    {
      if (this.inner.foregroundOnly) return true;
      if (this.outer && this.outer.foregroundOnly) return true;

      return false;
    }
    generateRandom(minAlpha: number, rng?: any)
    {
      var rng = rng || new RNG(Math.random);
      this.alpha = rng.uniform();
      this.alpha = clamp(this.alpha, minAlpha, 1);

      this.generateSubEmblems(rng);
    }
    generateSubEmblems(rng: any)
    {
      var allEmblems = [];

      function getSeededRandomArrayItem(array)
      {
        var _rnd = Math.floor(rng.uniform() * array.length);
        return array[_rnd];
      }

      for (var subEmblem in Templates.SubEmblems)
      {
        allEmblems.push(Templates.SubEmblems[subEmblem]);
      }

      var mainEmblem = getSeededRandomArrayItem(allEmblems);

      if (mainEmblem.type === "both")
      {
        this.inner = mainEmblem;
        return;
      }
      else if (mainEmblem.type === "inner" || mainEmblem.type === "outer")
      {
        this[mainEmblem.type] = mainEmblem;
      }
      else // inner-or-both || outer-or-both
      {
        if (rng.uniform() > 0.5)
        {
          this.inner = mainEmblem;
          return;
        }
        else if (mainEmblem.type === "inner-or-both")
        {
          this.inner = mainEmblem;
        }
        else
        {
          this.outer = mainEmblem;
        }
      }


      if (mainEmblem.type === "inner" || mainEmblem.type === "inner-or-both")
      {
        var subEmblem = getSeededRandomArrayItem(allEmblems.filter(function(emblem)
        {
          return (emblem.type === "outer" || emblem.type === "outer-or-both");
        }));

        this.outer = subEmblem;
      }
      else if (mainEmblem.type === "outer" || mainEmblem.type === "outer-or-both")
      {
        var subEmblem = getSeededRandomArrayItem(allEmblems.filter(function(emblem)
        {
          return (emblem.type === "inner" || emblem.type === "inner-or-both");
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
      var image = app.images["emblems"][toDraw.imageSrc];


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
        innerSrc: this.inner.imageSrc
      };

      if (this.outer) data.outerSrc = this.outer.imageSrc

      return(data);
    }
  }
}
