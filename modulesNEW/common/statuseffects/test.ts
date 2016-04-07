import SFXParams from "../../../src/templateinterfaces/SFXParams.d.ts";
import StatusEffectTemplate from "../../../src/templateinterfaces/StatusEffectTemplate.d.ts";
import {healSelf} from "../effectactions/effectActions.ts";

const test: StatusEffectTemplate =
{
  type: "test",
  displayName: "test",
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
      action: healSelf,
      data:
      {
        maxHealthPercentage: -0.1
      },
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

export default test;
