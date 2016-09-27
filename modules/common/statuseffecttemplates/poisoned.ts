import SFXParams from "../../../src/templateinterfaces/SFXParams";
import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate";
import {adjustHealth} from "../effectactiontemplates/effectActions";
import {bindEffectActionData} from "../effectactiontemplates/effectActions";

const poisoned: StatusEffectTemplate =
{
  type: "poisoned",
  displayName: "Poisoned",
  description: "-10% max health per turn",
  attributes:
  {
    attack:
    {
      flat: 9
    },
    defence:
    {
      flat: 9
    },
    speed:
    {
      flat: 9
    }
  },
  afterAbilityUse:
  [
    {
      id: "removeHealth",
      getUnitsInArea: (user, target, battle) => [user],
      executeAction: bindEffectActionData(adjustHealth,
      {
        maxHealthPercentage: -0.1
      }),
      sfx:
      {
        duration: 1200,
        userOverlay: function(props: SFXParams)
        {
          var canvas = <HTMLCanvasElement> document.createElement("canvas");
          canvas.width = props.width;
          canvas.height = props.height;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgba(30, 150, 30, 0.5)"
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          return canvas;
        }
      }
    }
  ]
}

export default poisoned;
