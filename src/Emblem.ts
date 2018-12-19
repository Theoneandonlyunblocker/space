/// <reference path="../lib/rng.d.ts" />

import Color from "./Color";
import {activeModuleData} from "./activeModuleData";
import
{
  generateMainColor,
  generateSecondaryColor,
} from "./colorGeneration";
import
{
  getSeededRandomArrayItem,
} from "./utility";

import EmblemSaveData from "./savedata/EmblemSaveData";

import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";


export default class Emblem
{
  public colors: Color[];
  public template: SubEmblemTemplate;

  constructor(colors: Color[], template: SubEmblemTemplate)
  {
    this.colors = colors;
    this.template = template;
  }
  public static generateRandom(backgroundColor?: Color, colors: Color[] = [], seed?: string): Emblem
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

    return new Emblem(
      _colors,
      template,
    );
  }
  private static getAvailableTemplatesForRandomGeneration(): SubEmblemTemplate[]
  {
    return Object.keys(activeModuleData.templates.SubEmblems).map(key =>
    {
      return activeModuleData.templates.SubEmblems[key];
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
      colors: this.colors.map(color => color.serialize()),
      templateKey: this.template.key,
    };

    return data;
  }

  private createElementClone(): SVGElement
  {
    return this.template.getSvgElementClone();
  }
}
