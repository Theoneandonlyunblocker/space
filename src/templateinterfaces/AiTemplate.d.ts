import {Personality} from "../ai/Personality";
import {TradeOffer} from "../trade/TradeOffer";
import {Unit} from "../unit/Unit";

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
  respondToTradeOffer(receivedOffer: TradeOffer): TradeOffer;

  serialize(): SaveData;
}
