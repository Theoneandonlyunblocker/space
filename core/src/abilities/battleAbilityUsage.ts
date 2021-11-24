import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";

import {AbilityUseEffect} from "./AbilityUseEffect";
import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";
import {UnitDisplayData} from "../unit/UnitDisplayData";
import { getTargetOrGuard } from "core/src/abilities/battleAbilityProcessing";
import { turnEndPhase } from "../combat/core/phases/turnEndPhase";


// TODO 2021.11.23 | this is all temporary
let effectIdGenerator: number = 0;

export function useAbility(
  battle: Battle,
  ability: CombatAbilityTemplate,
  user: Unit,
  intendedTarget: Unit,
): void
{
  const combatManager = battle.combatManager;

  const target = getTargetOrGuard(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: intendedTarget,
  });

  ability.use(user, target, combatManager);

  while(combatManager.currentPhase.template !== turnEndPhase)
  {
    combatManager.advancePhase();
  }
}
export function useAbilityAndGetUseEffects(
  battle: Battle,
  ability: CombatAbilityTemplate,
  user: Unit,
  intendedTarget: Unit,
): AbilityUseEffect[]
{
  const combatManager = battle.combatManager;
  const abilityUseEffects: AbilityUseEffect[] = [];

  const target = getTargetOrGuard(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: intendedTarget,
  });

  ability.use(user, target, combatManager);

  while(combatManager.currentPhase.template !== turnEndPhase)
  {
    combatManager.advancePhase(action =>
    {
      if (action.source && action.target)
      {
        const changedUnitDisplayData: {[unitId: number]: UnitDisplayData} = {};
        changedUnitDisplayData[action.source.id] = action.source.getDisplayData("battle");
        changedUnitDisplayData[action.target.id] = action.target.getDisplayData("battle");

        abilityUseEffects.push(
        {
          effectId: "" + effectIdGenerator++,
          changedUnitDisplayData: changedUnitDisplayData,
          vfx: ability.vfx,
          vfxUser: action.source,
          vfxTarget: action.target,
          newEvaluation: battle.getEvaluation(),
        });
      }
    });
  }

  return abilityUseEffects;
}
