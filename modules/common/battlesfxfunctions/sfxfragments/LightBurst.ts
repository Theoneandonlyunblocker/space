/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import LightBurstFilter from "../shaders/LightBurst";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  makeShaderSprite,
} from "../../../../src/utility";

interface PartialLightBurstProps
{
  size?: Point;
  delay?: number;
  sharpness?: number;
  color?: Color;
  centerSize?: number;
  rayStrength?: number;
}
interface LightBurstProps extends PartialLightBurstProps
{
  size: Point;
  delay: number;
  sharpness: number;
  color: Color;
  centerSize: number;
  rayStrength: number;
}
const defaultLightBurstProps: LightBurstProps =
{
  size: {x: 200, y: 200},
  delay: 0.3,
  sharpness: 2.0,
  color: new Color(0.75, 0.75, 0.62),
  centerSize: 1.0,
  rayStrength: 1.0,
};
const LightBurstPropTypes: SFXFragmentPropTypes =
{
  size: "point",
  delay: "number",
  sharpness: "number",
  color: "color",
  centerSize: "number",
  rayStrength: "number",
};


export default class LightBurst extends SFXFragment<LightBurstProps, PartialLightBurstProps>
{
  public displayName = "LightBurst";
  public key = "lightBurst";

  private lightBurstFilter: LightBurstFilter;
  private seed: number[] = [Math.random() * 69, Math.random() * 420];

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
      centerSize: Math.pow(lightBurstIntensity, 2.0) * this.props.centerSize,
      centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
      rayStrength: Math.pow(lightBurstIntensity, 3.0) * this.props.rayStrength,
    });
  }
  public draw(): void
  {
    this.lightBurstFilter = new LightBurstFilter(
    {
      seed: this.seed,
      rotation: 0,
      raySharpness: this.props.sharpness,
      rayColor: this.props.color.getRGBA(1.0),
    });

    const lightBurstSprite = makeShaderSprite(
      this.lightBurstFilter,
      0,
      0,
      this.props.size.x,
      this.props.size.y,
    );

    lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(lightBurstSprite);
  }
}

