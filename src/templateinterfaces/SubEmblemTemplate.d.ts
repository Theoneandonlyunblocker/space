import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  src: string;

  /**
   * Selectors to map colors to.
   * Probably should put most important stuff first for ease of customization.
   */
  colorMappings:
  {
    [selector: string]: string; // name of style prop to assign color value to
  }[];

  generateColors?(backgroundColor?: Color, colors?: Color[]): Color[];

  disallowRandomGeneration?: boolean;
}

export default SubEmblemTemplate;
