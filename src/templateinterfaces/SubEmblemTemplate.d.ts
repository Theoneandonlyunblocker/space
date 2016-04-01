import SubEmblemCoverage from "../SubEmblemCoverage.ts";
import SubEmblemPosition from "../SubEmblemPosition.ts";

declare interface SubEmblemTemplate
{
  key: string;
  src: string;
  coverage: SubEmblemCoverage[];
  position: SubEmblemPosition[];
  onlyCombineWith?: string[];
  disallowRandomGeneration?: boolean;
}

export default SubEmblemTemplate;
