/// <reference path="../../src/targeting.ts" />
/// <reference path="../../src/unit.ts" />

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
      effect: (user: Unit, target: Unit) => void;
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
      export var rangedAttack: IEffectTemplate =
      {
        name: "rangedAttack",
        targetFleets: "enemy",
        targetingFunction: targetSingle,
        targetRange: "all",
        effect: function(user: Unit, target: Unit)
        {
          var baseDamage = 100;
          var damageType = "physical";

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
          var damageType = "physical";

          var damageIncrease = user.getAttackDamageIncrease(damageType);
          var damage = baseDamage * damageIncrease;

          console.log(baseDamage, damageIncrease, damage);
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
          target.removeStrength(100);
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
          target.removeStrength(100);
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
