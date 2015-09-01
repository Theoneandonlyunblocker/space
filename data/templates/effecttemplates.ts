/// <reference path="../../src/targeting.ts" />
/// <reference path="../../src/unit.ts" />
/// <reference path="../../src/damagetype.ts" />

module Rance
{
  export module Templates
  {
    export interface IEffectTemplate
    {
      name: string;

      targetFleets: string; // ally, enemy, all
      targetingFunction: TargetingFunction;
      targetRange: string; // self, close, all
      effect: (user: Unit, target: Unit, data?: any) => void;
    }

    export module Effects
    {
      export var dummyTargetColumn: IEffectTemplate =
      {
        name: "dummyTargetColumn",
        targetFleets: "enemy",
        targetingFunction: targetColumn,
        targetRange: "all",
        effect: function(){}
      }
      export var dummyTargetAll: IEffectTemplate =
      {
        name: "dummyTargetAll",
        targetFleets: "enemy",
        targetingFunction: targetAll,
        targetRange: "all",
        effect: function(){}
      }
      export var singleTargetDamage: IEffectTemplate =
      {
        name: "singleTargetDamage",
        targetFleets: "enemy",
        targetingFunction: targetSingle,
        targetRange: "all",
        effect: function(user: Unit, target: Unit, data?: any)
        {
          var data = data || {};
          data.baseDamage = data.baseDamage || 100;
          data.damageType = data.damageType || DamageType.physical;

          var baseDamage = data.baseDamage;
          var damageType = data.damageType;

          var damageIncrease = user.getAttackDamageIncrease(damageType);
          var damage = baseDamage * damageIncrease;

          target.recieveDamage(damage, damageType);
        }
      }
      export var closeAttack: IEffectTemplate =
      {
        name: "closeAttack",
        targetFleets: "enemy",
        targetingFunction: targetColumnNeighbors,
        targetRange: "close",
        effect: function(user: Unit, target: Unit)
        {
          var baseDamage = 100;
          var damageType = DamageType.physical;

          var damageIncrease = user.getAttackDamageIncrease(damageType);
          var damage = baseDamage * damageIncrease;

          target.recieveDamage(damage, damageType);
        }
      }
      export var wholeRowAttack: IEffectTemplate =
      {
        name: "wholeRowAttack",
        targetFleets: "all",
        targetingFunction: targetRow,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          var baseDamage = 100;
          var damageType = DamageType.magical;

          var damageIncrease = user.getAttackDamageIncrease(damageType);
          var damage = baseDamage * damageIncrease;

          target.recieveDamage(damage, damageType);
        }
      }

      export var bombAttack: IEffectTemplate =
      {
        name: "bombAttack",
        targetFleets: "enemy",
        targetingFunction: targetNeighbors,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          var baseDamage = 100;
          var damageType = DamageType.physical;

          var damageIncrease = user.getAttackDamageIncrease(damageType);
          var damage = baseDamage * damageIncrease;

          target.recieveDamage(damage, damageType);
        }
      }
      export var guardColumn: IEffectTemplate =
      {
        name: "guardColumn",
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "self",
        effect: function(user: Unit, target: Unit)
        {
          var guardPerInt = 20;
          var guardAmount = guardPerInt * user.attributes.intelligence;
          user.addGuard(guardAmount, "column");
        }
      }
      export var increaseCaptureChance: IEffectTemplate =
      {
        name: "increaseCaptureChance",
        targetFleets: "enemy",
        targetingFunction: targetSingle,
        targetRange: "all",
        effect: function(user: Unit, target: Unit, data?: any)
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
      export var buffTest: IEffectTemplate =
      {
        name: "buffTest",
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          user.addStatusEffect(new StatusEffect(
          {
            attack:
            {
              flat: 3
            },
            defence:
            {
              flat: -3
            }
          }, 1));
        }
      }

      export var standBy: IEffectTemplate =
      {
        name: "standBy",
        targetFleets: "all",
        targetingFunction: targetSingle,
        targetRange: "self",
        effect: function(){}
      }
    }
  }
}
