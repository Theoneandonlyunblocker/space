import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  getSvgElementClone: () => SVGElement;

  // Probably should put most important stuff first for ease of customization.
  colorMappings:
  {
    displayName: string;
    selectors:
    {
      selector: string;
      attributeName: string;
    }[];
  }[];

  generateColors?(backgroundColor?: Color, colors?: Color[]): Color[];

  disallowRandomGeneration?: boolean;
}

export default SubEmblemTemplate;
