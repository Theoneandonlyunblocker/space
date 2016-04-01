namespace Templates
{
  declare interface ISubEmblemTemplate
  {
    key: string;
    src: string;
    coverage: SubEmblemCoverage[];
    position: SubEmblemPosition[];
    onlyCombineWith?: string[];
    disallowRandomGeneration?: boolean;
  }
}
