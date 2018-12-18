import Color from "../../../src/Color";

export const iconSources =
{
  starBase: "modules/space/buildings/img/starBase.svg",
  sectorCommand: "modules/space/buildings/img/sectorCommand.svg",
};

export const svgCache: {[key: string]: SVGElement} = {};

export function createIconElement(key: keyof typeof iconSources, color: Color): SVGElement
{
  const sourceElement = svgCache[key];
  const clone = <SVGElement> sourceElement.cloneNode(true);

  clone.setAttribute("preserveAspectRatio", "xMidYMid meet");

  // TODO 2018.12.18 | apply color

  return clone;
}
