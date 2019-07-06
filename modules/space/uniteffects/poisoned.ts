import {UnitEffectTemplate} from "../../../src/templateinterfaces/UnitEffectTemplate";
import {adjustHealth} from "../effectactions/effectActions";


export const poisoned: UnitEffectTemplate =
{
  type: "poisoned",
  displayName: "Poisoned",
  description: "-10% max health per turn",
  attributes:
  {
    attack:
    {
      flat: 9,
    },
    defence:
    {
      flat: 9,
    },
    speed:
    {
      flat: 9,
    },
  },
  afterAbilityUse:
  [
    {
      id: "removeHealth",
      getUnitsInArea: (user, target, battle) => [user],
      executeAction: adjustHealth.bind(null,
      {
        maxHealthPercentage: -0.1,
      }),
      sfx:
      {
        duration: 1200,
        userOverlay: (params) =>
        {
          const canvas = <HTMLCanvasElement> document.createElement("canvas");
          canvas.width = params.width;
          canvas.height = params.height;
          const ctx = canvas.getContext("2d");
          if (!ctx)
          {
            throw new Error("Couldn't get context");
          }
          else
          {
            ctx.fillStyle = "rgba(30, 150, 30, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          return canvas;
        },
      },
    },
  ],
};
