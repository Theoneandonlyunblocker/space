import
{
  AITemplateConstructor,
} from "../../../src/templateinterfaces/AITemplateConstructor";

import DefaultAI from "./DefaultAI";
import DefaultAISaveData from "./DefaultAISaveData";

const DefaultAIConstructor: AITemplateConstructor<DefaultAISaveData> =
{
  type: DefaultAI.type,
  construct: props =>
  {
    return new DefaultAI(props.player, props.game, props.personality);
  },
}

export default DefaultAIConstructor;
