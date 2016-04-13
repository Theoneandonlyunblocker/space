import SubEmblemCoverage from "../SubEmblemCoverage";
import SubEmblemPosition from "../SubEmblemPosition";

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
