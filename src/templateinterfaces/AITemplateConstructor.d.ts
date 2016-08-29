import AITemplate from "./AITemplate";

import Player from "../Player";
import Game from "../Game";
import Personality from "../Personality";

export interface AITemplateConstructor<SaveData>
{
  type: string;
  
  construct(props:
  {
    game: Game;
    player: Player;
    personality: Personality;
    saveData?: SaveData;
  }): AITemplate<SaveData>;
}

export default AITemplateConstructor;
