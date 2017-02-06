/// <reference path="../../../../lib/pixi.d.ts" />

import RampingValue from "./RampingValue";
import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import BeamFilter from "../shaders/Beam";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  clamp,
  getRelativeValue,
  makeShaderSprite,
} from "../../../../src/utility";

interface PartialBeamProps
{
  size?: Point;
  relativeImpactTime?: number;
  relativeBeamOrigin?: Point;
  color?: Color;
  timeScale?: number;
  noiseAmplitude?: RampingValue;
  lineIntensity?: RampingValue;
  bulgeIntensity?: RampingValue;
  lineYSize?: RampingValue;
  bulgeSizeX?: RampingValue;
  bulgeSizeY?: RampingValue;
  bulgeSharpness?: RampingValue;
  lineXSharpness?: RampingValue;
  lineYSharpness?: RampingValue;
}
interface BeamProps extends PartialBeamProps
{
  size: Point;
  relativeImpactTime: number;
  relativeBeamOrigin: Point;
  color: Color;
  timeScale: number;
  noiseAmplitude: RampingValue;
  lineIntensity: RampingValue;
  bulgeIntensity: RampingValue;
  lineYSize: RampingValue;
  bulgeSizeX: RampingValue;
  bulgeSizeY: RampingValue;
  bulgeSharpness: RampingValue;
  lineXSharpness: RampingValue;
  lineYSharpness: RampingValue;
}
const defaultBeamProps: BeamProps =
{
  size:
  {
    x: 500,
    y: 500,
  },
  relativeImpactTime: 0.2,
  relativeBeamOrigin:
  {
    x: 0,
    y: 0.5,
  },
  color: new Color(1, 0.9, 0.9),
  timeScale: 100,
  noiseAmplitude: new RampingValue(0.0, 0.4, -0.4),
  lineIntensity: new RampingValue(2.0, 5.0, -5.0),
  bulgeIntensity: new RampingValue(0.0, 6.0, -6.0),
  lineYSize: new RampingValue(0.01, 0.2, -0.21),
  bulgeSizeX: new RampingValue(0.0, 0.7, -0.7),
  bulgeSizeY: new RampingValue(0.0, 0.4, -0.4),
  bulgeSharpness: new RampingValue(0.3, 0.35, -0.35),
  lineXSharpness: new RampingValue(0.99, -0.99, 0.99),
  lineYSharpness: new RampingValue(0.99, -0.15, 0.16),
};
const BeamPropTypes: SFXFragmentPropTypes =
{
  size: "point",
  relativeImpactTime: "number",
  relativeBeamOrigin: "point",
  color: "color",
  timeScale: "number",
  noiseAmplitude: "rampingValue",
  lineIntensity: "rampingValue",
  bulgeIntensity: "rampingValue",
  lineYSize: "rampingValue",
  bulgeSizeX: "rampingValue",
  bulgeSizeY: "rampingValue",
  bulgeSharpness: "rampingValue",
  lineXSharpness: "rampingValue",
  lineYSharpness: "rampingValue",
};


export default class Beam extends SFXFragment<BeamProps, PartialBeamProps>
{
  public displayName = "Beam";
  public key = "beam";

  private beamFilter: BeamFilter;
  private seed: number = Math.random() * 100;

  constructor(props: BeamProps)
  {
    super(BeamPropTypes, defaultBeamProps, props);
  }

  public animate(time: number): void
  {
    const rampUpValue = Math.pow(Math.min(time / this.props.relativeImpactTime, 1.0), 7.0);

    const timeAfterImpact = Math.max(time - this.props.relativeImpactTime, 0.0);
    const relativeTimeAfterImpact = getRelativeValue(timeAfterImpact, 0.0, 1.0 - this.props.relativeImpactTime);

    const rampDownValue = clamp(Math.pow(relativeTimeAfterImpact * 1.2, 12.0), 0.0, 1.0);

    this.animateFromRampValues(time, rampUpValue, rampDownValue);
  }
  public animateFromRampValues(time: number, rampUpValue: number, rampDownValue: number): void
  {
    this.beamFilter.setUniformValues(
    {
      time: time * this.props.timeScale,
      noiseAmplitude: this.props.noiseAmplitude.getValue(rampUpValue, rampDownValue),
      lineIntensity: this.props.lineIntensity.getValue(rampUpValue, rampDownValue),
      bulgeIntensity: this.props.bulgeIntensity.getValue(rampUpValue, rampDownValue),

      bulgeSize:
      [
        this.props.bulgeSizeX.getValue(Math.pow(rampUpValue, 1.5), rampDownValue),
        this.props.bulgeSizeY.getValue(Math.pow(rampUpValue, 1.5), rampDownValue),
      ],
      bulgeSharpness: this.props.bulgeSharpness.getValue(rampUpValue, rampDownValue),

      lineXSize:
      [
        this.props.relativeBeamOrigin.x * rampUpValue,
        1.0,
      ],
      lineYSize: this.props.lineYSize.getValue(rampUpValue, rampDownValue),

      lineXSharpness: this.props.lineXSharpness.getValue(rampUpValue, rampDownValue),
      lineYSharpness: this.props.lineYSharpness.getValue(rampUpValue, rampDownValue),
    });
  }
  public draw(): void
  {
    this.beamFilter = new BeamFilter(
    {
      seed: this.seed,
      beamColor: this.props.color.getRGBA(1.0),
      aspectRatio: this.props.size.x / this.props.size.y,
      bulgeXPosition: this.props.relativeBeamOrigin.x + 0.1,
      beamYPosition: this.props.relativeBeamOrigin.y,
    });

    const beamSprite = makeShaderSprite(
      this.beamFilter,
      0,
      0,
      this.props.size.x,
      this.props.size.y,
    );
    beamSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(beamSprite);
  }
}
