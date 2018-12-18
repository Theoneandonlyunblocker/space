import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  /**
   * should point to .svg file
   */
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
