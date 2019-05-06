import
{
  AiTemplateConstructor,
} from "../../../src/templateinterfaces/AiTemplateConstructor";

import DefaultAi from "./DefaultAi";
import DefaultAiSaveData from "./DefaultAiSaveData";


const defaultAiConstructor: AiTemplateConstructor<DefaultAiSaveData> =
{
  type: DefaultAi.type,
  construct: props =>
  {
    return new DefaultAi(props.player, props.game, props.personality);
  },
};

export default defaultAiConstructor;
