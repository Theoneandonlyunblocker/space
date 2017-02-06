import PassiveSkillTemplate from "../../../src/templateinterfaces/PassiveSkillTemplate";

import BattlePrep from "../../../src/BattlePrep";
import GuardCoverage from "../../../src/GuardCoverage";
import Unit from "../../../src/Unit";

import autoHealStatusEffect from "../statuseffecttemplates/autoHeal";
import poisonedStatusEffect from "../statuseffecttemplates/poisoned";

import * as EffectActions from "../effectactiontemplates/effectActions";
import {bindEffectActionData} from "../effectactiontemplates/effectActions";

export var autoHeal: PassiveSkillTemplate =
{
  type: "autoHeal",
  displayName: "Auto heal",
  description: "Restore 50 health after every action",

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: bindEffectActionData(EffectActions.addStatusEffect,
      {
        duration: -1,
        template: autoHealStatusEffect
      })
    }
  ]
}
export var overdrive: PassiveSkillTemplate =
{
  type: "overdrive",
  displayName: "Overdrive",
  description: "Gives buffs at battle start but become poisoned",

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: bindEffectActionData(EffectActions.addStatusEffect,
      {
        duration: 2,
        template: poisonedStatusEffect
      })
    }
  ]
}
export var initialGuard: PassiveSkillTemplate =
{
  type: "initialGuard",
  displayName: "Initial Guard",
  description: "Adds initial guard",
  isHidden: true,

  atBattleStart:
  [
    {
      id: "addStatusEffect",
      getUnitsInArea: user => [user],
      executeAction: bindEffectActionData(EffectActions.addGuard,
      {
        coverage: GuardCoverage.row,
        flat: 50
      })
    }
  ],
  inBattlePrep:
  [
    function(user: Unit, battlePrep: BattlePrep)
    {
      EffectActions.addGuard(
      {
        coverage: GuardCoverage.row,
        flat: 50
      },
      user, user, null, {});
    }
  ]
}
export var medic: PassiveSkillTemplate =
{
  type: "medic",
  displayName: "Medic",
  description: "Heals all units in same star to full at turn start",

  atTurnStart:
  [
    function(user: Unit)
    {
      var star = user.fleet.location;
      var allFriendlyUnits = star.getUnits(player => player === user.fleet.player);
      for (let i = 0; i < allFriendlyUnits.length; i++)
      {
        allFriendlyUnits[i].addHealth(allFriendlyUnits[i].maxHealth)
      }
    }
  ]
}
export var warpJammer: PassiveSkillTemplate =
{
  type: "warpJammer",
  displayName: "Warp Jammer",
  description: "Forces an extra unit to defend in neutral territory",

  inBattlePrep:
  [
    function(user: Unit, battlePrep: BattlePrep)
    {
      if (battlePrep.isLocationNeutral() && user.fleet.player === battlePrep.attacker)
      {
        battlePrep.minDefenders += 1;
      }
    }
  ],
  canUpgradeInto: [medic]
}
