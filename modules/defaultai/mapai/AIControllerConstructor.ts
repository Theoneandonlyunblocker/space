import
{
  AITemplateConstructor,
  AITemplateConstructorProps
} from "../../../src/templateinterfaces/AITemplateConstructor";

import AIController from "./AIController";
import AIControllerSaveData from "./AIControllerSaveData";

const AIControllerConstructor: AITemplateConstructor<AIControllerSaveData> =
{
  type: AIController.type,
  construct: (props) =>
  {
    return new AIController(props.player, props.game, props.personality);
  }
}

export default AIControllerConstructor;
