import { CombatActionResultTemplate } from "./CombatActionResultTemplate";
import { Unit } from "../unit/Unit";
import { CombatManager } from "./CombatManager";
import { CorePhase } from "./core/coreCombatPhases";
import { CombatAction } from "./CombatAction";


export class CombatActionResults<Phase extends string = CorePhase>
{
  private readonly valuesByKey:
  {
    [key: string]: any;
  } = {};
  private readonly templatesByKey:
  {
    [key: string]: CombatActionResultTemplate<any, Phase>;
  } = {};

  constructor()
  {

  }

  public get<T>(template: CombatActionResultTemplate<T, Phase>): T
  {
    if (this.valuesByKey[template.key] === undefined)
    {
      return template.defaultValue;
    }
    else
    {
      return this.valuesByKey[template.key];
    }
  }
  public set<T>(template: CombatActionResultTemplate<T, Phase>, value: T): void
  {
    this.templatesByKey[template.key] = template;
    this.valuesByKey[template.key] = value;
  }
  public apply(
    source: Unit,
    target: Unit,
    combatManager: CombatManager<Phase>,
    parentAction: CombatAction,
  ): void
  {
    Object.keys(this.templatesByKey).forEach(key =>
    {
      this.templatesByKey[key].applyResult(
        this.valuesByKey[key],
        source,
        target,
        combatManager,
        parentAction,
      );
    });
  }
}
