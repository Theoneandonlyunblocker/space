import AITemplate from "./templateinterfaces/AITemplate";

import AIControllerSaveData from "./savedata/AIControllerSaveData";

import Personality from "./Personality";
import Unit from "./Unit";

export default class AIController
{
  private template: AITemplate<any>;
  public personality: Personality;

  constructor(template: AITemplate<any>)
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
  public evaluateUnitStrength(...units: Unit[]): number
  {
    return this.template.evaluateUnitStrength(...units);
  }
  public serialize(): AIControllerSaveData<any>
  {
    return(
    {
      templateType: this.template.type,
      templateData: this.template.serialize(),
      personality: this.personality,
    });
  }
}
