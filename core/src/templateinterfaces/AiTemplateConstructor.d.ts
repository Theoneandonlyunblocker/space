import {Game} from "../game/Game";
import {Personality} from "../ai/Personality";
import {Player} from "../player/Player";

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
  key: string;

  construct(props: AiTemplateConstructorProps<SaveData>): AiTemplate<SaveData>;
}
