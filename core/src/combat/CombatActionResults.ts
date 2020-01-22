import { CombatActionResultTemplate } from "./CombatActionResultTemplate";
import { Unit } from "../unit/Unit";
import { Battle } from "../battle/Battle";


export class CombatActionResults
{
  private readonly valuesByKey:
  {
    [key: string]: any;
  } = {};
  private readonly templatesByKey:
  {
    [key: string]: CombatActionResultTemplate<any>;
  } = {};

  constructor()
  {

  }

  public get<T>(template: CombatActionResultTemplate<T>): T
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
  public set<T>(template: CombatActionResultTemplate<T>, value: T): void
  {
    this.templatesByKey[template.key] = template;
    this.valuesByKey[template.key] = value;
  }
  public apply(source: Unit, target: Unit, battle: Battle): void
  {
    Object.keys(this.templatesByKey).forEach(key =>
    {
      this.templatesByKey[key].applyResult(
        this.valuesByKey[key],
        source,
        target,
        battle,
      );
    });
  }
}
