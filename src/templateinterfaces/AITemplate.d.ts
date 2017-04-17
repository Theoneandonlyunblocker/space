import Personality from "../Personality";
import Trade from "../Trade";
import {TradeResponse} from "../TradeResponse";
import Unit from "../Unit";

export interface AITemplate<SaveData>
{
  type: string;
  personality: Personality;

  processTurn(afterFinishedCallback: () => void): void;
  createBattleFormation(
    availableUnits: Unit[],
    hasScouted: boolean,
    enemyUnits?: Unit[],
    enemyFormation?: Unit[][],
  ): Unit[][];
  respondToTradeOffer(
    receivedOffer: Trade,
    ownTrade: Trade,
  ): TradeResponse

  serialize(): SaveData;
}

export default AITemplate;
