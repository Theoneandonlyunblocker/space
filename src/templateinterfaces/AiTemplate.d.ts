import Personality from "../Personality";
import {TradeOffer} from "../TradeOffer";
import Unit from "../Unit";

export interface AiTemplate<SaveData>
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
    receivedOffer: TradeOffer,
  ): TradeOffer

  serialize(): SaveData;
}

export default AiTemplate;
