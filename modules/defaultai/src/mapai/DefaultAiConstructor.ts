import
{
  AiTemplateConstructor,
} from "core/src/templateinterfaces/AiTemplateConstructor";

import {DefaultAi} from "./DefaultAi";
import {DefaultAiSaveData} from "./DefaultAiSaveData";


export const defaultAiConstructor: AiTemplateConstructor<DefaultAiSaveData> =
{
  type: DefaultAi.type,
  construct: props =>
  {
    return new DefaultAi(props.player, props.game, props.personality);
  },
};
