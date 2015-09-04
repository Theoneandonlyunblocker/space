/// <reference path="effecttemplates.ts" />
/// <reference path="battleeffectsfxtemplates.ts" />

module Rance
{
  // TODO move these
  export function makeSprite(imgSrc: string, props: Templates.SFXParams)
  {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");


    var img = new Image();

    img.onload = function(e)
    {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      if (!props.facingRight)
      {
        ctx.scale(-1, 1);
      }
    }

    // cg13300.bmp
    img.src = imgSrc;


    return canvas;
  }
  export function makeVideo(videoSrc: string, props: Templates.SFXParams)
  {
    var video = document.createElement("video");

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var maskCanvas = document.createElement("canvas");
    var mask = maskCanvas.getContext("2d");
    mask.fillStyle = "#000";
    mask.globalCompositeOperation = "luminosity";


    var onVideoLoadFN = function()
    {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      video.play();
    }

    var _: any = window;
    if (!_.abababa) _.abababa = {};
    if (!_.abababa[videoSrc]) _.abababa[videoSrc] = {}
    var computeFrameFN = function(frameNumber: number)
    {
      if (!_.abababa[videoSrc][frameNumber])
      {
        var c3 = document.createElement("canvas");
        c3.width = canvas.width;
        c3.height = canvas.height;
        var ctx3 = c3.getContext("2d");

        ctx3.drawImage(video, 0, 0, c3.width, c3.height);

        var frame = ctx3.getImageData(0, 0, c3.width, c3.height);

        mask.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        mask.drawImage(video, 0, 0, c3.width, c3.height);

        var maskData = mask.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        var l = frame.data.length / 4;
        for (var i = 0; i < l; i++)
        {
          frame.data[i * 4 + 3] = maskData[i * 4];
        }

        ctx3.putImageData(frame, 0, 0);
        _.abababa[videoSrc][frameNumber] = c3;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!props.facingRight)
      {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(_.abababa[videoSrc][frameNumber], 0, 0, canvas.width, canvas.height);
    }
    var previousFrame: number;

    var playFrameFN = function()
    {
      if (video.paused || video.ended) return;
      var currentFrame = Math.round(roundToNearestMultiple(video.currentTime, 1 / 24) / (1 / 24));
      if (isFinite(previousFrame) && currentFrame === previousFrame)
      {
        
      }
      else
      {
        previousFrame = currentFrame;
        computeFrameFN(currentFrame);
      }
      requestAnimFrame(playFrameFN);
    }

    video.oncanplay = onVideoLoadFN;
    video.onplay = playFrameFN;

    video.src = videoSrc;

    if (video.readyState >= 4)
    {
      onVideoLoadFN();
    }

    return canvas;
  }
  export module Templates
  {
    export interface IAbilityTemplateEffect
    {
      template: IEffectTemplate;
      data?: any;
      // called after parent effect with same user and effect target
      // nesting these wont work and wouldnt do anything anyway
      attachedEffects?: IAbilityTemplateEffect[];
      sfx?: IBattleEffectSFX;
    }
    export interface IAbilityTemplate
    {
      type: string;
      displayName: string;
      description: string;
      moveDelay: number;
      preparation?:
      {
        turnsToPrep: number;
        prepDelay: number;
        interruptsNeeded: number;
      };
      actionsUse: number;

      // determines targeting range of function, called first
      mainEffect: IAbilityTemplateEffect;
      // combined with mainEffect, determines target area of function, called second
      // uses same user and target as maineffect, can have own target area
      secondaryEffects?: IAbilityTemplateEffect[];

      beforeUse?: IAbilityTemplateEffect[];
      afterUse?: IAbilityTemplateEffect[];

      addsGuard?: boolean; // set dynamically
    }

    export module Abilities
    {
      export var dummyTargetColumn: IAbilityTemplate =
      {
        type: "dummyTargetColumn",
        displayName: "dummyTargetColumn",
        description: "you shouldnt see this",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.dummyTargetColumn
        }
      }
      export var dummyTargetAll: IAbilityTemplate =
      {
        type: "dummyTargetAll",
        displayName: "dummyTargetAll",
        description: "you shouldnt see this",
        moveDelay: 0,
        actionsUse: 0,
        mainEffect:
        {
          template: Effects.dummyTargetAll
        }
      }
      export var rangedAttack: IAbilityTemplate =
      {
        type: "rangedAttack",
        displayName: "Ranged Attack",
        description: "Standard ranged attack",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
          },
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
                baseDamage: 1
              }
            }
          ]
        }
      }
      export var closeAttack: IAbilityTemplate =
      {
        type: "closeAttack",
        displayName: "Close Attack",
        description: "Close range attack that hits adjacent targets in same row as well",
        moveDelay: 90,
        actionsUse: 2,
        mainEffect:
        {
          template: Effects.closeAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }
      export var wholeRowAttack: IAbilityTemplate =
      {
        type: "wholeRowAttack",
        displayName: "Row Attack",
        description: "Attack entire row of units",
        moveDelay: 300,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.wholeRowAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }

      export var bombAttack: IAbilityTemplate =
      {
        type: "bombAttack",
        displayName: "Bomb Attack",
        description: "Ranged attack that hits all adjacent enemy units",
        moveDelay: 120,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.bombAttack,
          sfx:
          {
            duration: 1500
          }
        }
      }
      export var guardColumn: IAbilityTemplate =
      {
        type: "guardColumn",
        displayName: "Guard Column",
        description: "Protect allies in the same row and boost defence up to 2x",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.guardColumn,
          sfx:
          {
            duration: 1500
          }
        }
      }
      export var boardingHook: IAbilityTemplate =
      {
        type: "boardingHook",
        displayName: "Boarding Hook",
        description: "0.8x damage but increases target capture chance",
        moveDelay: 100,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
          },
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
                baseDamage: 1
              }
            }
          ]
        }
      }

      export var debugAbility: IAbilityTemplate =
      {
        type: "debugAbility",
        displayName: "Debug Ability",
        description: "who knows what its going to do today",
        moveDelay: 20,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.singleTargetDamage,
          sfx:
          {
            duration: 1500,
          },
          data:
          {
            baseDamage: 5,
            damageType: DamageType.physical
          },
          attachedEffects:
          [
            {
              template: Effects.receiveCounterAttack,
              data:
              {
                baseDamage: 1
              }
            }
          ]
        },
        secondaryEffects:
        [
          {
            template: Effects.bombAttack,
            sfx:
            {
              duration: 200,
            }
          }
        ],
        afterUse:
        [
          {
            template: Effects.buffTest,
            sfx:
            {
              duration: 200,
            }
          }
        ]
      }

      export var ranceAttack: IAbilityTemplate =
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
            userSprite: function(props: SFXParams)
            {
              // cg13600.bmp
              return makeSprite("img\/battleEffects\/ranceAttack2.png", props);
            },
            battleOverlay: function(props: SFXParams)
            {
              // cg40500.bmp - cg40529.bmp converted to webm
              return makeVideo("img\/battleEffects\/ranceAttack.webm", props);
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
                  baseDamage: 0.1
                }
              }
            ],
            sfx:
            {
              duration: 1500,
              userSprite: function(props: SFXParams)
              {
                // cg13300.bmp
                return makeSprite("img\/battleEffects\/ranceAttack.png", props);
              },
              battleOverlay: function(props: SFXParams)
              {
                // cg40000.bmp - cg40029.bmp converted to webm
                return makeVideo("img\/battleEffects\/bushiAttack.webm", props);
              }
            }
          }
        ]
      }

      export var standBy: IAbilityTemplate =
      {
        type: "standBy",
        displayName: "Standby",
        description: "Skip a turn but next one comes faster",
        moveDelay: 50,
        actionsUse: 1,
        mainEffect:
        {
          template: Effects.standBy,
          sfx:
          {
            duration: 750,
            userSprite: function(props: SFXParams)
            {
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");

              canvas.width = 80;
              canvas.height = 80

              ctx.fillStyle = "#FFF";
              ctx.fillRect(20, 20, 40, 40);

              return canvas;
            }
          }
        }
      }
    }
  }
}
