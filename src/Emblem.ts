/// <reference path="../lib/rng.d.ts" />

import {activeModuleData} from "./activeModuleData";
import Color from "./Color";
import
{
  generateMainColor,
  generateSecondaryColor,
} from "./colorGeneration";
import {svgCache} from "./svgCache";
import
{
  getSeededRandomArrayItem,
  randRange,
} from "./utility";

import EmblemSaveData from "./savedata/EmblemSaveData";

import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";


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
  public draw(): SVGElement
  {
    const sourceElement = svgCache[this.template.src];
    const result = <SVGElement> sourceElement.cloneNode(true);

    this.template.colorMappings.forEach((selectorMap: {[selector: string]: string}, i: number) =>
    {
      // TODO 2017.12.21 |
      // const color = this.colors[i];
      const color = this.colors[0];

      for (let selector in selectorMap)
      {
        const selection = result.querySelectorAll(selector);
        const styleProp = selectorMap[selector];

        for (let j = 0; j < selection.length; j++)
        {
          const match = <SVGElement> selection[j];
          match.style[styleProp] = `#${color.getHexString()}`;
        }
      }
    });

    return result;
  }
  // // TODO 29.9.2016 | actually use svg attributes
  // public draw(maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement
  // {
  //   const image = app.images[this.template.src];

  //   let width = image.width;
  //   let height = image.height;

  //   if (stretch)
  //   {
  //     const widthRatio = width / maxWidth;
  //     const heightRatio = height / maxHeight;

  //     const largestRatio = Math.max(widthRatio, heightRatio);
  //     width /= largestRatio;
  //     height /= largestRatio;
  //   }
  //   else
  //   {
  //     width = Math.min(width, maxWidth);
  //     height = Math.max(height, maxHeight);
  //   }

  //   const canvas = document.createElement("canvas");
  //   canvas.width = width;
  //   canvas.height = height;
  //   const ctx = canvas.getContext("2d");

  //   if (!ctx)
  //   {
  //     throw new Error("Couldn't get canvas context");
  //   }

  //   ctx.drawImage(image, 0, 0, width, height);

  //   ctx.globalCompositeOperation = "source-in";

  //   ctx.fillStyle = "#" + this.colors[0].getHexString();
  //   ctx.fillRect(0, 0, width, height);

  //   return canvas;
  // }
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
