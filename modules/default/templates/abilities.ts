/// <reference path="../graphics/makesfxfromvideo.ts"/>
/// <reference path="../../../src/templateinterfaces/sfxparams.d.ts"/>
/// <reference path="../../../src/templateinterfaces/iabilitytemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/iabilityeffecttemplate.d.ts"/>
/// <reference path="effectactions.ts" />
/// <reference path="battlesfx.ts" />


namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace Abilities
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
              action: EffectActions.singleTargetDamage,
              sfx: BattleSFX.rocketAttack,
              data:
              {
                baseDamage: 1,
                damageType: DamageType.physical
              },
              attachedEffects:
              [
                {
                  action: EffectActions.receiveCounterAttack,
                  data:
                  {
                    baseDamage: 0.5
                  }
                }
              ]
            },
            canUpgradeInto: ["bombAttack", "boardingHook", "ranceAttack"]
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
              action: EffectActions.closeAttack,
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
              action: EffectActions.wholeRowAttack,
              sfx: BattleSFX.particleTest
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
              action: EffectActions.bombAttack,
              sfx: BattleSFX.rocketAttack
            }
          }
          export var guardRow: Rance.Templates.IAbilityTemplate =
          {
            type: "guardRow",
            displayName: "Guard Row",
            description: "Protect allies in the same row and boost defence up to 2x",
            moveDelay: 100,
            actionsUse: 1,
            mainEffect:
            {
              action: EffectActions.guardRow,
              sfx: BattleSFX.guard,
              data:
              {
                perInt: 20
              }
            }
          }
          export var guardColumn = guardRow; // legacy alias 10.3.2016
          export var boardingHook: Rance.Templates.IAbilityTemplate =
          {
            type: "boardingHook",
            displayName: "Boarding Hook",
            description: "0.8x damage but increases target capture chance",
            moveDelay: 100,
            actionsUse: 1,
            mainEffect:
            {
              action: EffectActions.singleTargetDamage,
              sfx: BattleSFX.rocketAttack,
              data:
              {
                baseDamage: 0.8,
                damageType: DamageType.physical
              },
              attachedEffects:
              [
                {
                  action: EffectActions.increaseCaptureChance,
                  data:
                  {
                    flat: 0.5
                  }
                },
                {
                  action: EffectActions.receiveCounterAttack,
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
            actionsUse: 1,
            mainEffect:
            {
              action: EffectActions.buffTest,
              sfx: BattleSFX.guard,
              data: {}
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
              action: EffectActions.singleTargetDamage,
              sfx:
              {
                duration: 1200,
                userSprite: function(props: Rance.Templates.SFXParams)
                {
                  // cg13600.bmp
                  return PIXI.Sprite.fromImage("img\/battleEffects\/ranceAttack2.png");
                }
                // battleOverlay: function(props: Rance.Templates.SFXParams)
                // {
                //   // cg40500.bmp - cg40529.bmp converted to webm
                //   return BattleSFXFunctions.makeVideo("img\/battleEffects\/ranceAttack.webm", props);
                // }
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
                action: EffectActions.singleTargetDamage,
                data:
                {
                  baseDamage: 0.1,
                  damageType: DamageType.physical
                },
                attachedEffects:
                [
                  {
                    action: EffectActions.receiveCounterAttack,
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
                    return PIXI.Sprite.fromImage("img\/battleEffects\/ranceAttack.png");
                  }
                  // battleOverlay: function(props: Rance.Templates.SFXParams)
                  // {
                  //   // cg40000.bmp - cg40029.bmp converted to webm
                  //   return BattleSFXFunctions.makeVideo("img\/battleEffects\/bushiAttack.webm", props);
                  // }
                }
              }
            ],
            onlyAllowExplicitUpgrade: true
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
              action: EffectActions.standBy,
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
