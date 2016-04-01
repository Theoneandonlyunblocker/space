declare namespace Rance
{
  namespace Templates
  {
    interface ISubEmblemTemplate
    {
      key: string;
      src: string;
      coverage: SubEmblemCoverage[];
      position: SubEmblemPosition[];
      onlyCombineWith?: string[];
      disallowRandomGeneration?: boolean;
    }
  }
}
