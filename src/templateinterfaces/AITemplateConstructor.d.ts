import AITemplate from "./AITemplate";

import Player from "../Player";
import Game from "../Game";
import Personality from "../Personality";

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
