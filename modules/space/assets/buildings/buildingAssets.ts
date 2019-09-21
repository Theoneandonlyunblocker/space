import {Color} from "core/src/color/Color";


export const buildingIconSources =
{
  starBase:      "./assets/buildings/img/starBase.svg",
  sectorCommand: "./assets/buildings/img/sectorCommand.svg",
};

export const buildingSvgCache: {[K in keyof typeof buildingIconSources]?: SVGElement} = {};

export function getBuildingIconElement(key: keyof typeof buildingIconSources, color: Color): SVGElement
{
  const sourceElement = buildingSvgCache[key];
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
