import { CombatEffect } from "./CombatEffect";
import { CorePhase } from "./core/coreCombatPhases";
import { CombatEffectTemplate } from "./CombatEffectTemplate";


export class CombatEffectManager<Phase extends string = CorePhase>
{
  private readonly effects:
  {
    [key: string]: CombatEffect<Phase>;
  } = {};

  constructor()
  {

  }

  public get(template: CombatEffectTemplate<Phase>): CombatEffect<Phase>
  {
    if (!this.effects[template.key])
    {
      this.effects[template.key] = new CombatEffect<Phase>(
      {
        template: template,
        initialStrength: 0,
      });
    }

    return this.effects[template.key];
  }
  public clone(): CombatEffectManager<Phase>
  {
    const cloned = new CombatEffectManager<Phase>();

    for (const key in this.effects)
    {
      cloned.effects[key] = this.effects[key].clone();
    }

    return cloned;
  }
}
