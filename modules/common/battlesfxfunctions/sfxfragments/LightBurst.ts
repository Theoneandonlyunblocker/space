/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import LightBurstFilter from "../shaders/LightBurst";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  createDummySpriteForShader
} from "../../../../src/utility";

interface PartialLightBurstProps
{
  size?: Point;
  delay?: number;
  rotation?: number;
  sharpness?: number;
  color?: Color;
}
interface LightBurstProps extends PartialLightBurstProps
{
  size: Point;
  delay: number;
  rotation: number;
  sharpness: number;
  color: Color;
}
const defaultLightBurstProps: LightBurstProps =
{
  size: {x: 200, y: 200},
  delay: 0.3,
  rotation: 0.0,
  sharpness: 2.0,
  color: new Color(0.75, 0.75, 0.62)
}
const LightBurstPropTypes: SFXFragmentPropTypes =
{
  size: "point",
  delay: "number",
  rotation: "number",
  sharpness: "number",
  color: "color",
}


export default class LightBurst extends SFXFragment<LightBurstProps, PartialLightBurstProps>
{
  type: "LightBurst";
  
  private lightBurstFilter: LightBurstFilter;

  constructor(props: LightBurstProps)
  {
    super(LightBurstPropTypes, defaultLightBurstProps, props);
  }
  
  public animate(time: number): void
  {
    var rampUpValue = Math.min(time / this.props.delay, 1.0);
    rampUpValue = Math.pow(rampUpValue, 7.0);

    var timeAfterImpact = Math.max(time - this.props.delay, 0.0);
    var rampDownValue = Math.pow(timeAfterImpact * 5.0, 2.0);

    var lightBurstIntensity = Math.max(rampUpValue - rampDownValue, 0.0);

    this.lightBurstFilter.setUniformValues(
    {
      centerSize: Math.pow(lightBurstIntensity, 2.0),
      centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
      rayStrength: Math.pow(lightBurstIntensity, 3.0)
    });
  }
  public draw(): void
  {
    this.lightBurstFilter = new LightBurstFilter(
    {
      seed: [Math.random() * 69, Math.random() * 420],
      rotation: this.props.rotation,
      raySharpness: this.props.sharpness,
      rayColor: this.props.color.getRGBA(1.0)
    });

    const lightBurstSprite = createDummySpriteForShader(
      0,
      0,
      this.props.size.x,
      this.props.size.y
    );

    lightBurstSprite.shader = this.lightBurstFilter;
    lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(lightBurstSprite);
  }
}

