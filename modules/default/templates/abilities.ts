/// <reference path="../../../src/battlesfxfunctions/battlesfxutils.ts"/>
/// <reference path="../../../src/templateinterfaces/sfxparams.d.ts"/>
/// <reference path="../../../src/templateinterfaces/iabilitytemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/iabilitytemplateeffect.d.ts"/>
/// <reference path="effects.ts" />
/// <reference path="battlesfx.ts" />


module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Abilities
        {
          export var rangedAttack: Rance.Templates.IAbilityTemplate =
          {
            type: "rangedAttack",
            displayName: "Ranged Attack",
            description: "Standard ranged attack",
            moveDelay: 100,
            actionsUse: 1,
            mainEffect:
            {
              template: Effects.singleTargetDamage,
              sfx: BattleSFX.rocketAttack,
              data:
              {
                baseDamage: 1,
                damageType: DamageType.physical
              },
              attachedEffects:
              [
                {
                  template: Effects.receiveCounterAttack,
                  data:
                  {
                    baseDamage: 0.5
                  }
                }
              ]
            }
          }
          export var closeAttack: Rance.Templates.IAbilityTemplate =
          {
            type: "closeAttack",
            displayName: "Close Attack",
            description: "Close range attack that hits adjacent targets in same row as well",
            moveDelay: 90,
            actionsUse: 2,
            mainEffect:
            {
              template: Effects.closeAttack,
              sfx: BattleSFX.rocketAttack
            }
          }
          export var wholeRowAttack: Rance.Templates.IAbilityTemplate =
          {
            type: "wholeRowAttack",
            displayName: "Row Attack",
            description: "Attack entire row of units",
            moveDelay: 300,
            actionsUse: 1,
            bypassesGuard: true,
            mainEffect:
            {
              template: Effects.wholeRowAttack,
              sfx: BattleSFX.rocketAttack
            }
          }

          export var bombAttack: Rance.Templates.IAbilityTemplate =
          {
            type: "bombAttack",
            displayName: "Bomb Attack",
            description: "Ranged attack that hits all adjacent enemy units",
            moveDelay: 120,
            actionsUse: 1,
            mainEffect:
            {
              template: Effects.bombAttack,
              sfx: BattleSFX.rocketAttack
            }
          }
          export var guardColumn: Rance.Templates.IAbilityTemplate =
          {
            type: "guardColumn",
            displayName: "Guard Column",
            description: "Protect allies in the same row and boost defence up to 2x",
            moveDelay: 100,
            actionsUse: 1,
            mainEffect:
            {
              template: Effects.guardColumn,
              sfx: BattleSFX.guard,
              data:
              {
                perInt: 20
              }
            }
          }
          export var boardingHook: Rance.Templates.IAbilityTemplate =
          {
            type: "boardingHook",
            displayName: "Boarding Hook",
            description: "0.8x damage but increases target capture chance",
            moveDelay: 100,
            actionsUse: 1,
            mainEffect:
            {
              template: Effects.singleTargetDamage,
              sfx: BattleSFX.rocketAttack,
              data:
              {
                baseDamage: 0.8,
                damageType: DamageType.physical
              },
              attachedEffects:
              [
                {
                  template: Effects.increaseCaptureChance,
                  data:
                  {
                    flat: 0.5
                  }
                },
                {
                  template: Effects.receiveCounterAttack,
                  data:
                  {
                    baseDamage: 0.5
                  }
                }
              ]
            }
          }

          export var debugAbility: Rance.Templates.IAbilityTemplate =
          {
            type: "debugAbility",
            displayName: "Debug Ability",
            description: "who knows what its going to do today",
            moveDelay: 0,
            preparation:
            {
              turnsToPrep: 1,
              prepDelay: 50,
              interruptsNeeded: 1
            },
            actionsUse: 0,
            mainEffect:
            {
              template: Effects.guardColumn,
              sfx: BattleSFX.guard,
              data:
              {
                perInt: 20
              }
            }
          }

          export var ranceAttack: Rance.Templates.IAbilityTemplate =
          {
            type: "ranceAttack",
            displayName: "Rance attack",
            description: "dont sue",
            moveDelay: 0,
            actionsUse: 0,
            mainEffect:
            {
              template: Effects.singleTargetDamage,
              sfx:
              {
                duration: 1200,
                userSprite: function(props: Rance.Templates.SFXParams)
                {
                  // cg13600.bmp
                  return BattleSFXFunctions.makeSprite("img\/battleEffects\/ranceAttack2.png", props);
                },
                battleOverlay: function(props: Rance.Templates.SFXParams)
                {
                  // cg40500.bmp - cg40529.bmp converted to webm
                  return BattleSFXFunctions.makeVideo("img\/battleEffects\/ranceAttack.webm", props);
                }
              },
              data:
              {
                baseDamage: 0.1,
                damageType: DamageType.physical
              }
            },
            secondaryEffects:
            [
              {
                template: Effects.singleTargetDamage,
                data:
                {
                  baseDamage: 0.1,
                  damageType: DamageType.physical
                },
                attachedEffects:
                [
                  {
                    template: Effects.receiveCounterAttack,
                    data:
                    {
                      baseDamage: 0.5
                    }
                  }
                ],
                sfx:
                {
                  duration: 1500,
                  userSprite: function(props: Rance.Templates.SFXParams)
                  {
                    // cg13300.bmp
                    return BattleSFXFunctions.makeSprite("img\/battleEffects\/ranceAttack.png", props);
                  },
                  battleOverlay: function(props: Rance.Templates.SFXParams)
                  {
                    // cg40000.bmp - cg40029.bmp converted to webm
                    return BattleSFXFunctions.makeVideo("img\/battleEffects\/bushiAttack.webm", props);
                  }
                }
              }
            ]
          }

          export var standBy: Rance.Templates.IAbilityTemplate =
          {
            type: "standBy",
            displayName: "Standby",
            description: "Skip a turn but next one comes faster",
            moveDelay: 50,
            actionsUse: 1,
            AIEvaluationPriority: 0.6,
            AIScoreAdjust: -0.1,
            disableInAIBattles: true,
            mainEffect:
            {
              template: Effects.standBy,
              sfx:
              {
                duration: 750
              }
            }
          }
        }
      }
    }
  }
}
