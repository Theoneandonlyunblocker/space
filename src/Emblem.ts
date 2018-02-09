/// <reference path="../lib/rng.d.ts" />

import Color from "./Color";
import {activeModuleData} from "./activeModuleData";
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
    const result = this.createElementClone();

    result.classList.add("emblem");
    result.setAttribute("preserveAspectRatio", "xMidYMid meet");

    this.template.colorMappings.forEach((colorMap, i) =>
    {
      const color = this.colors[i];

      colorMap.selectors.forEach(selectorData =>
      {
        const selection = result.querySelectorAll(selectorData.selector);

        for (let j = 0; j < selection.length; j++)
        {
          const match = <SVGElement> selection[j];
          const colorString = color ? `#${color.getHexString()}` : "none";
          match.setAttribute(selectorData.attributeName, colorString);
        }
      });
    });

    return result;
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

  private createElementClone(): SVGElement
  {
    const sourceElement = svgCache[this.template.src];
    const clone = <SVGElement> sourceElement.cloneNode(true);

    return clone;
  }
}
