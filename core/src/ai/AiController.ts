import {AiTemplate} from "../templateinterfaces/AiTemplate";

import {AiControllerSaveData} from "../savedata/AiControllerSaveData";

import {Personality} from "./Personality";
import {TradeOffer} from "../trade/TradeOffer";
import {Unit} from "../unit/Unit";


export class AiController<SaveData>
{
  public personality: Personality;

  private template: AiTemplate<SaveData>;

  constructor(template: AiTemplate<SaveData>)
  {
    this.template = template;
    this.personality = template.personality;
  }

  public processTurn(afterFinishedCallback: () => void): void
  {
    this.template.processTurn(afterFinishedCallback);
  }
  public createBattleFormation(
    availableUnits: Unit[],
    hasScouted: boolean,
    enemyUnits?: Unit[],
    enemyFormation?: Unit[][],
  ): Unit[][]
  {
    return this.template.createBattleFormation(
      availableUnits,
      hasScouted,
      enemyUnits,
      enemyFormation,
    );
  }
  public respondToTradeOffer(receivedOffer: TradeOffer): TradeOffer
  {
    return this.template.respondToTradeOffer(receivedOffer);
  }
  public serialize(): AiControllerSaveData<SaveData>
  {
    return(
    {
      template: this.template.key,
      templateData: this.template.serialize(),
      personality: this.personality,
    });
  }
}
