import Game from "../Game";
import Personality from "../Personality";
import Player from "../Player";

import AITemplate from "./AITemplate";

export interface AITemplateConstructorProps<SaveData>
{
  game: Game;
  player: Player;
  personality: Personality;
  saveData?: SaveData;
}

export interface AITemplateConstructor<SaveData>
{
  type: string;

  construct(props: AITemplateConstructorProps<SaveData>): AITemplate<SaveData>;
}

export default AITemplateConstructor;
