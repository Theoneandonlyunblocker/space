import {StatusEffectSaveData} from "./savedata/StatusEffectSaveData";
import {UnitEffectTemplate} from "./templateinterfaces/UnitEffectTemplate";

import {Unit} from "./Unit";
import {idGenerators} from "./idGenerators";


export class StatusEffect
{
  public id: number;
  public template: UnitEffectTemplate;
  // incremented after status effect actions are called
  public turnsHasBeenActiveFor: number = 0;
  public turnsToStayActiveFor: number;

  public sourceUnit: Unit;

  constructor(props:
  {
    template: UnitEffectTemplate;
    id?: number;
    turnsHasBeenActiveFor?: number;
    turnsToStayActiveFor: number;
    sourceUnit: Unit;
  })
  {
    this.id = isFinite(props.id) ? props.id : idGenerators.statusEffect++;
    this.template = props.template;
    this.turnsToStayActiveFor = props.turnsToStayActiveFor;
    this.turnsHasBeenActiveFor = props.turnsHasBeenActiveFor || 0;
    this.sourceUnit = props.sourceUnit;
  }

  public clone(): StatusEffect
  {
    const effect = new StatusEffect(
    {
      template: this.template,
      turnsToStayActiveFor: this.turnsToStayActiveFor,
      turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
      id: this.id,
      sourceUnit: this.sourceUnit,
    });

    return effect;
  }

  public processTurnEnd(): void
  {
    this.turnsHasBeenActiveFor++;
  }
  public serialize(): StatusEffectSaveData
  {
    return(
    {
      id: this.id,
      templateType: this.template.type,
      turnsToStayActiveFor: this.turnsToStayActiveFor,
      turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
      sourceUnitId: this.sourceUnit.id,
    });
  }
}
