import {Game} from "../Game";
import {Personality} from "../Personality";
import {Player} from "../Player";

import {AiTemplate} from "./AiTemplate";

export interface AiTemplateConstructorProps<SaveData>
{
  game: Game;
  player: Player;
  personality: Personality;
  saveData?: SaveData;
}

export interface AiTemplateConstructor<SaveData>
{
  type: string;

  construct(props: AiTemplateConstructorProps<SaveData>): AiTemplate<SaveData>;
}
