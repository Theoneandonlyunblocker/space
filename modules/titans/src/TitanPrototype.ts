import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { TitanComponentTemplate } from "./TitanComponentTemplate";


export type TitanPrototype =
{
  wasAiGenerated: boolean;
  key: string;
  displayName: string;
  chassis: TitanChassisTemplate;
  components: TitanComponentTemplate[];
};
