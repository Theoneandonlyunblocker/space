import {UnitEffectTemplate} from "core/src/templateinterfaces/UnitEffectTemplate";
import {adjustHealth} from "../effectactions/effectActions";
import { localize } from "modules/space/localization/localize";


export const poisoned: UnitEffectTemplate =
{
  type: "poisoned",
  get displayName()
  {
    return localize("poisoned_displayName");
  },
  get description()
  {
    return localize("poisoned_description");
  },
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
      vfx:
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
