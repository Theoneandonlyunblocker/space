import {Color} from "../color/Color";

export interface SubEmblemTemplate
{
  key: string;
  getSvgElementClone: () => SVGElement;

  // Probably should put most significant ones first for ease of customization.
  colorMappings:
  {
    displayName: string;
    selectors:
    {
      selector: string;
      attributeName: string;
    }[];
  }[];

  getColors?(backgroundColor?: Color, colors?: Color[]): Color[];

  disallowRandomGeneration?: boolean;
}
