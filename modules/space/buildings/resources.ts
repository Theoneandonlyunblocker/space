import {Color} from "../../../src/color/Color";


export const iconSources =
{
  starBase:      "./img/starBase.svg",
  sectorCommand: "./img/sectorCommand.svg",
};

export const svgCache: {[K in keyof typeof iconSources]?: SVGElement} = {};

export function getIconElement(key: keyof typeof iconSources, color: Color): SVGElement
{
  const sourceElement = svgCache[key];
  const clone = <SVGElement> sourceElement.cloneNode(true);

  clone.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const toFill = clone.querySelectorAll(".building-main");
  for (let i = 0; i < toFill.length; i++)
  {
    const match = <SVGElement> toFill[i];
    match.setAttribute("fill", `#${color.getHexString()}`);
  }

  return clone;
}
