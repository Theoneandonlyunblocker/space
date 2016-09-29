import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  src: string;

  /**
   * SVG classes to map colors to.
   * Probably should put most important stuff first.
   */
  colorMappings?: string[][];
  generateColors?(backgroundColor: Color, colors: Color[]): Color[]
  
  disallowRandomGeneration?: boolean;
}

export default SubEmblemTemplate;
