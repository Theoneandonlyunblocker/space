/// <reference path="../lib/rng.d.ts" />

import app from "./App"; // TODO global
import {activeModuleData} from "./activeModuleData";

import Color from "./Color";
import
{
  generateMainColor,
  generateSecondaryColor,
} from "./colorGeneration";
import EmblemSaveData from "./savedata/EmblemSaveData";
import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";
import
{
  getSeededRandomArrayItem,
  randRange,
} from "./utility";

export default class Emblem
{
  alpha: number;
  colors: Color[];
  template: SubEmblemTemplate;

  constructor(colors: Color[], template: SubEmblemTemplate, alpha: number = 1)
  {
    this.colors = colors;
    this.alpha = alpha;
    this.template = template;
  }
  public static generateRandom(backgroundColor?: Color, colors: Color[] = [], minAlpha: number = 1, seed?: string): Emblem
  {
    const _rng = new RNG(seed);

    const templates = Emblem.getAvailableTemplatesForRandomGeneration();
    const template = getSeededRandomArrayItem(templates, _rng);

    let _colors: Color[];
    if (template.generateColors)
    {
      _colors = template.generateColors(backgroundColor, colors);
    }
    else
    {
      if (colors.length > 0)
      {
        _colors = colors.slice(0);
      }
      else
      {
        if (backgroundColor)
        {
          _colors = [generateSecondaryColor(backgroundColor)];
        }
        else
        {
          _colors = [generateMainColor()];
        }
      }
    }

    const alpha = randRange(minAlpha, 1);

    return new Emblem(
      _colors,
      template,
      alpha,
    );
  }
  private static getAvailableTemplatesForRandomGeneration(): SubEmblemTemplate[]
  {
    return Object.keys(activeModuleData.Templates.SubEmblems).map(key =>
    {
      return activeModuleData.Templates.SubEmblems[key];
    }).filter(template =>
    {
      return !template.disallowRandomGeneration;
    });
  }
  public isDrawable(): boolean
  {
    const amountOfColorsIsWithinRange = this.colors.length > 0;

    return this.alpha > 0 && amountOfColorsIsWithinRange;
  }
  // TODO 29.9.2016 | actually use svg attributes
  public draw(maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement
  {
    const image = app.images[this.template.src];

    let width = image.width;
    let height = image.height;

    if (stretch)
    {
      const widthRatio = width / maxWidth;
      const heightRatio = height / maxHeight;

      const largestRatio = Math.max(widthRatio, heightRatio);
      width /= largestRatio;
      height /= largestRatio;
    }
    else
    {
      width = Math.min(width, maxWidth);
      height = Math.max(height, maxHeight);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, width, height);

    ctx.globalCompositeOperation = "source-in";

    ctx.fillStyle = "#" + this.colors[0].getHexString();
    ctx.fillRect(0, 0, width, height);

    return canvas;
  }
  public serialize(): EmblemSaveData
  {
    const data: EmblemSaveData =
    {
      alpha: this.alpha,
      colors: this.colors.map(color => color.serialize()),
      templateKey: this.template.key,
    };

    return data;
  }
}
