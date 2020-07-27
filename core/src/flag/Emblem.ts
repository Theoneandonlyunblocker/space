import * as RNG from "rng-js";

import {Color} from "../color/Color";
import {activeModuleData} from "../app/activeModuleData";
import
{
  generateMainColor,
  generateSecondaryColor,
} from "../color/colorGeneration";
import
{
  getSeededRandomArrayItem,
} from "../generic/utility";

import {EmblemSaveData} from "../savedata/EmblemSaveData";

import {SubEmblemTemplate} from "../templateinterfaces/SubEmblemTemplate";


export class Emblem
{
  public colors: Color[];
  public template: SubEmblemTemplate;

  constructor(colors: Color[], template: SubEmblemTemplate)
  {
    this.colors = template.getColors ? template.getColors(null, colors) : colors;
    this.template = template;
  }

  public static generateRandom(backgroundColor?: Color, colors: Color[] = [], seed?: string): Emblem
  {
    const _rng = new RNG(seed);

    const templates = Emblem.getAvailableTemplatesForRandomGeneration();
    const template = getSeededRandomArrayItem(templates, _rng);

    let _colors: Color[];
    if (template.getColors)
    {
      _colors = template.getColors(backgroundColor, colors);
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

  private static getAvailableTemplatesForRandomGeneration(): SubEmblemTemplate[]
  {
    return activeModuleData.templates.subEmblems.filter(template => !template.disallowRandomGeneration);
  }
}
