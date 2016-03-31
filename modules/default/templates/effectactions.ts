/// <reference path="../../../src/templateinterfaces/ieffectactiontemplate.d.ts"/>
/// <reference path="../../../src/targeting.ts" />
/// <reference path="../../../src/unit.ts" />
/// <reference path="../../../src/damagetype.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace EffectActions
        {
          export var singleTargetDamage: Rance.Templates.IEffectActionTemplate =
          {
            name: "singleTargetDamage",
            targetFormations: TargetFormation.enemy,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle,
              data: {baseDamage: number; damageType: number;})
            {
              var baseDamage = data.baseDamage;
              var damageType = data.damageType;

              var damageIncrease = user.getAttackDamageIncrease(damageType);
              var damage = baseDamage * damageIncrease;

              target.receiveDamage(damage, damageType);
            }
          }
          export var closeAttack: Rance.Templates.IEffectActionTemplate =
          {
            name: "closeAttack",
            targetFormations: TargetFormation.enemy,
            battleAreaFunction: areaRowNeighbors,
            targetRangeFunction: targetNextRow,
            executeAction: function(user: Unit, target: Unit, battle: Battle)
            {
              var baseDamage = 0.66;
              var damageType = DamageType.physical;

              var damageIncrease = user.getAttackDamageIncrease(damageType);
              var damage = baseDamage * damageIncrease;

              target.receiveDamage(damage, damageType);
            }
          }
          export var wholeRowAttack: Rance.Templates.IEffectActionTemplate =
          {
            name: "wholeRowAttack",
            targetFormations: TargetFormation.either,
            battleAreaFunction: areaColumn,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle)
            {
              var baseDamage = 0.75;
              var damageType = DamageType.magical;

              var damageIncrease = user.getAttackDamageIncrease(damageType);
              var damage = baseDamage * damageIncrease;

              target.receiveDamage(damage, damageType);
            }
          }

          export var bombAttack: Rance.Templates.IEffectActionTemplate =
          {
            name: "bombAttack",
            targetFormations: TargetFormation.enemy,
            battleAreaFunction: areaNeighbors,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle)
            {
              var baseDamage = 0.5;
              var damageType = DamageType.physical;

              var damageIncrease = user.getAttackDamageIncrease(damageType);
              var damage = baseDamage * damageIncrease;

              target.receiveDamage(damage, damageType);
            }
          }
          export var guardRow: Rance.Templates.IEffectActionTemplate =
          {
            name: "guardRow",
            targetFormations: TargetFormation.either,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetSelf,
            executeAction: function(user: Unit, target: Unit, battle: Battle, data?: any)
            {
              var data = data || {};
              var guardPerInt = data.perInt || 0;
              var flat = data.flat || 0;

              var guardAmount = guardPerInt * user.attributes.intelligence + flat;
              user.addGuard(guardAmount, GuardCoverage.row);
            }
          }
          export var receiveCounterAttack: Rance.Templates.IEffectActionTemplate =
          {
            name: "receiveCounterAttack",
            targetFormations: TargetFormation.either,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetSelf,
            executeAction: function(user: Unit, target: Unit, battle: Battle,
              data: {baseDamage: number; damageType: number;})
            {
              var counterStrength = target.getCounterAttackStrength();
              if (counterStrength)
              {
                Templates.EffectActions.singleTargetDamage.executeAction(target, user, battle,
                {
                  baseDamage: data.baseDamage * counterStrength,
                  damageType: DamageType.physical
                });
              }
            }
          }
          export var increaseCaptureChance: Rance.Templates.IEffectActionTemplate =
          {
            name: "increaseCaptureChance",
            targetFormations: TargetFormation.enemy,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle,
              data: {flat?: number; multiplier?: number;})
            {
              if (!data) return;
              if (data.flat)
              {
                target.battleStats.captureChance += data.flat;
              }
              if (isFinite(data.multiplier))
              {
                target.battleStats.captureChance *= data.multiplier;
              }

            }
          }
          export var buffTest: Rance.Templates.IEffectActionTemplate =
          {
            name: "buffTest",
            targetFormations: TargetFormation.either,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle)
            {
              target.addStatusEffect(new StatusEffect(StatusEffects.test, 2));
            }
          }
          export var healTarget: Rance.Templates.IEffectActionTemplate =
          {
            name: "healTarget",
            targetFormations: TargetFormation.ally,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetAll,
            executeAction: function(user: Unit, target: Unit, battle: Battle,
              data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number})
            {
              var healAmount = 0;
              if (data.flat)
              {
                healAmount += data.flat;
              }
              if (data.maxHealthPercentage)
              {
                healAmount += target.maxHealth * data.maxHealthPercentage;
              }
              if (data.perUserUnit)
              {
                healAmount += data.perUserUnit * user.getAttackDamageIncrease(DamageType.magical);
              }

              target.removeStrength(-healAmount);
            }
          }

          export var healSelf: Rance.Templates.IEffectActionTemplate =
          {
            name: "healSelf",
            targetFormations: TargetFormation.ally,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetSelf,
            executeAction: function(user: Unit, target: Unit, battle: Battle,
              data: {flat?: number; maxHealthPercentage?: number; perUserUnit?: number})
            {
              Templates.EffectActions.healTarget.executeAction(user, user, battle, data);
            }
          }

          export var standBy: Rance.Templates.IEffectActionTemplate =
          {
            name: "standBy",
            targetFormations: TargetFormation.either,
            battleAreaFunction: areaSingle,
            targetRangeFunction: targetSelf,
            executeAction: function(){}
          }
        }
      }
    }
  }
}
