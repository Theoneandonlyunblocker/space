/// <reference path="../lib/rng.d.ts" />

import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate.d.ts";
import EmblemSaveData from "./savedata/EmblemSaveData.d.ts";
import Color from "./Color.ts";
import SubEmblemCoverage from "./SubEmblemCoverage.ts";
import SubEmblemPosition from "./SubEmblemPosition.ts";
import
{
  clamp,
  getSeededRandomArrayItem
} from "./utility.ts"

export class Emblem
{
  alpha: number;
  color: Color;
  inner: SubEmblemTemplate;
  outer: SubEmblemTemplate;
  constructor(color: Color, alpha?: number,
    inner?: SubEmblemTemplate, outer?: SubEmblemTemplate)
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
  getPossibleSubEmblemsToAdd(): SubEmblemTemplate[]
  {
    var possibleTemplates: SubEmblemTemplate[] = [];

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
  drawSubEmblem(toDraw: SubEmblemTemplate,
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

    ctx.fillStyle = "#" + this.color.getHexString();
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
  serialize(): EmblemSaveData
  {
    var data: EmblemSaveData =
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
