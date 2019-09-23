import {SvgCache} from "core/src/generic/SvgCache";


const iconSources =
{
  "hasty-grave": "./assets/img/hasty-grave.svg",
  "swords-emblem": "./assets/img/swords-emblem.svg",
  "crossed-swords": "./assets/img/crossed-swords.svg",
};
const otherSvgSources =
{
  "icon-gradient": "./assets/img/icon-gradient.svg",
};

const svgCache = new SvgCache({...iconSources, ...otherSvgSources});
export const loadSvg = svgCache.load.bind(svgCache);

type Icon = {
  element: SVGElement;
  background: SVGElement;
  foreground: SVGElement;
  gradient: SVGGradientElement;
  gradientStop1: SVGStopElement;
  gradientStop2: SVGStopElement;
};

export function getIcon(key: keyof typeof iconSources, ...id: (string | number)[]): Icon
{
  const width = 512;
  const height = 512;
  const stencil = svgCache.get(key);
  const idSuffix = `${key}-${id.join("-")}`;
  const baseGradientId = "notification-icon-gradient";

  const gradientDoc = svgCache.get("icon-gradient");
  const gradient = <SVGGradientElement>gradientDoc.querySelector(`#${baseGradientId}`);
  gradient.id = `${baseGradientId}-${idSuffix}`;

  const maskBase = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  maskBase.setAttribute("fill", "white");
  maskBase.setAttribute("width", `${width}`);
  maskBase.setAttribute("height", `${height}`);

  const stencilElement = stencil.firstChild;
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.id = `notification-icon-mask-${idSuffix}`;
  mask.appendChild(maskBase);
  mask.appendChild(stencilElement);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(mask);
  defs.appendChild(gradient);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", `${width}`);
  background.setAttribute("height", `${height}`);
  background.setAttribute("mask", `url(#${mask.id})`)
  background.classList.add("stenciled-svg-background");

  const foreground = <SVGElement> stencilElement.cloneNode(true);
  foreground.classList.add("stenciled-svg-foreground");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.appendChild(defs);
  svg.appendChild(background);
  svg.appendChild(foreground);

  return {
    element: svg,
    background: background,
    foreground: foreground,
    gradient: gradient,
    gradientStop1: <SVGStopElement>gradient.firstElementChild,
    gradientStop2: <SVGStopElement>gradient.lastElementChild,
  };
}
