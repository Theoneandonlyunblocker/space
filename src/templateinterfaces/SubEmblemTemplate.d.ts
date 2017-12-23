import Color from "../Color";

declare interface SubEmblemTemplate
{
  key: string;
  src: string;

  // Probably should put most important stuff first for ease of customization.
  colorMappings:
  {
    [selector: string]:
    {
      attributeName: string;
      displayName: string;
    };
  }[];

  generateColors?(backgroundColor?: Color, colors?: Color[]): Color[];

  disallowRandomGeneration?: boolean;
}

export default SubEmblemTemplate;
