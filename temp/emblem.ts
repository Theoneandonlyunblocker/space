/// <reference path="../lib/rng.d.ts" />
/// <reference path="templateinterfaces/isubemblemtemplate.d.ts" />
/// <reference path="savedata/iemblemsavedata.d.ts" />

/// <reference path="color.ts"/>

namespace Rance
{
  export enum SubEmblemCoverage
  {
    inner,
    outer,
    both
  }
  export enum SubEmblemPosition
  {
    foreground, // can be in foreground with bg emblem
    background, // can be in background with fg emblem
    both // can be alone
  }
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
    generateRandom(minAlpha: number, rng?: any): void
    {
      var rng: any = rng || new RNG(Math.random);
      this.alpha = rng.uniform();
      this.alpha = clamp(this.alpha, minAlpha, 1);

      this.generateSubEmblems(rng);
    }
    canAddOuterTemplate(): boolean
    {
      return (this.inner && this.inner.coverage.indexOf(SubEmblemCoverage.inner) !== -1);
    }
    getPossibleSubEmblemsToAdd(): Templates.ISubEmblemTemplate[]
    {
      var possibleTemplates: Templates.ISubEmblemTemplate[] = [];

      if (this.inner && this.outer)
      {
        throw new Error("Tried to get available sub emblems for emblem that already has both inner and outer");
      }

      if (!this.inner)
      {
        for (var key in app.moduleData.Templates.SubEmblems)
        {
          if (!app.moduleData.Templates.SubEmblems[key].disallowRandomGeneration)
          {
            possibleTemplates.push(app.moduleData.Templates.SubEmblems[key]);
          }
        }
      }
      else
      {
        if (this.canAddOuterTemplate())
        {
          for (var key in app.moduleData.Templates.SubEmblems)
          {
            var template = app.moduleData.Templates.SubEmblems[key];
            if (!template.disallowRandomGeneration && template.coverage.indexOf(SubEmblemCoverage.outer) !== -1)
            {
              possibleTemplates.push(template);
            }
          }
        }
      }

      return possibleTemplates;
    }
    generateSubEmblems(rng: any): void
    {
      var candidates = this.getPossibleSubEmblemsToAdd();
      this.inner = getSeededRandomArrayItem(candidates, rng);

      candidates = this.getPossibleSubEmblemsToAdd();
      if (candidates.length > 0 && rng.uniform() > 0.4)
      {
        this.outer = getSeededRandomArrayItem(candidates, rng);
      }
    }
    canAddBackground(): boolean
    {
      if (this.inner.position.indexOf(SubEmblemPosition.foreground) !== -1)
      {
        return (!this.outer || this.outer.position.indexOf(SubEmblemPosition.foreground) !== -1);
      }

      return false;
    }
    drawSubEmblem(toDraw: Templates.ISubEmblemTemplate,
      maxWidth: number, maxHeight: number, stretch: boolean)
    {
      var image = app.images[toDraw.src];

      var width = image.width;
      var height = image.height;

      if (stretch)
      {
        var widthRatio = width / maxWidth;
        var heightRatio = height / maxHeight;

        var largestRatio = Math.max(widthRatio, heightRatio);
        width /= largestRatio;
        height /= largestRatio;
      }

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      ctx.globalCompositeOperation = "source-in";

      ctx.fillStyle = "#" + hexToString(this.color);
      ctx.fillRect(0, 0, width, height);

      return canvas;
    }
    draw(maxWidth: number, maxHeight: number, stretch: boolean)
    {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      ctx.globalAlpha = this.alpha;

      var inner = this.drawSubEmblem(this.inner, maxWidth, maxHeight, stretch);
      canvas.width = inner.width;
      canvas.height = inner.height;
      ctx.drawImage(inner, 0, 0);

      if (this.outer)
      {
        var outer = this.drawSubEmblem(this.outer, maxWidth, maxHeight, stretch);
        ctx.drawImage(outer, 0, 0);
      }

      return canvas;
    }
    // drawSvgSubEmblem(toDraw: Templates.ISubEmblemTemplate, className: string)
    // {
    //   var htmlColor = "#" + hexToString(this.color);

    //   var container = document.createElement("object");
    //   container.addEventListener("load", function(e: Event)
    //   {
    //     var svg = container.contentDocument;
    //     var elementsToColor = svg.getElementsByClassName("emblem-color");

    //     for (var i = 0; i < elementsToColor.length; i++)
    //     {
    //       var svgElementToColor = <SVGSVGElement> elementsToColor[i];
    //       svgElementToColor.style.fill = htmlColor;
    //     }
    //   }, false);

    //   container.setAttribute("data", toDraw.src);
    //   container.setAttribute("type", "image/svg+xml");
    //   container.classList.add(className);

    //   return container;
    // }
    // drawSvg()
    // {
    //   var container = document.createElement("object");
    //   container.classList.add("emblem-container");

    //   var inner = this.drawSvgSubEmblem(this.inner, "inner-sub-emblem");
    //   container.appendChild(inner);

    //   if (this.outer)
    //   {
    //     var outer = this.drawSvgSubEmblem(this.outer, "outer-sub-emblem");
    //     container.appendChild(outer);
    //   }

    //   return container;
    // }
    serialize(): IEmblemSaveData
    {
      var data: IEmblemSaveData =
      {
        alpha: this.alpha,
        innerKey: this.inner.key
      };

      if (this.outer)
      {
        data.outerKey = this.outer.key;
      }

      return data;
    }
  }
}
