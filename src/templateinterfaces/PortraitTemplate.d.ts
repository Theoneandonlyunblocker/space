
declare interface PortraitTemplate
{
  key: string;
  // TODO 2018.12.20 | return element instead
  getImageSrc: () => string;
  randomGenerationTags?: string[];
}

export default PortraitTemplate;
