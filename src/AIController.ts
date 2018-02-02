import AITemplate from "./templateinterfaces/AITemplate";

import AIControllerSaveData from "./savedata/AIControllerSaveData";

import Personality from "./Personality";
import {TradeOffer} from "./TradeOffer";
import Unit from "./Unit";


export class AIController<SaveData>
{
  public personality: Personality;

  private template: AITemplate<SaveData>;

  constructor(template: AITemplate<SaveData>)
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
  public serialize(): AIControllerSaveData<SaveData>
  {
    return(
    {
      templateType: this.template.type,
      templateData: this.template.serialize(),
      personality: this.personality,
    });
  }
}
