import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  // TODO 2018.12.17 | rename this at least to reflect it should point to SVG url. could just do () => SVGElement instead
  src: string;

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
