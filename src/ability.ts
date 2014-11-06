/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>

module Rance
{
  export function useAbility(battle: Battle, user: Unit, template: AbilityTemplate)
  {

  }
  export function getPotentialTargets(battle: Battle, user: Unit, template: AbilityTemplate)
  {
    if (template.targetRange === "self")
    {
      return [user];
    }

    var fleetsToTarget;
  }
}
