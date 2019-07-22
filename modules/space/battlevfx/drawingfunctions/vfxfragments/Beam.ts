import * as PIXI from "pixi.js";

import {Color} from "../../../../../src/Color";
import {Point} from "../../../../../src/Point";
import
{
  makeShaderSprite,
} from "../../../../../src/pixiWrapperFunctions";
import
{
  clamp,
  getRelativeValue,
} from "../../../../../src/utility";
import {Beam as BeamFilter} from "../shaders/Beam";

import {RampingValue} from "./RampingValue";
import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";


interface BeamProps
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

export class Beam extends VfxFragment<BeamProps>
{
  public displayName = "Beam";
  public key = "beam";

  public readonly propInfo =
  {
    size: new PropInfo.Point({x: 500, y: 500}),
    relativeImpactTime: new PropInfo.Number(0.2),
    relativeBeamOrigin: new PropInfo.Point({x: 0, y: 0.5}),
    color: new PropInfo.Color(new Color(1, 0.9, 0.9)),
    timeScale: new PropInfo.Number(100),
    noiseAmplitude: new PropInfo.RampingValue(new RampingValue(0.0, 0.4, -0.4)),
    lineIntensity: new PropInfo.RampingValue(new RampingValue(2.0, 5.0, -5.0)),
    bulgeIntensity: new PropInfo.RampingValue(new RampingValue(0.0, 6.0, -6.0)),
    lineYSize: new PropInfo.RampingValue(new RampingValue(0.01, 0.2, -0.21)),
    bulgeSizeX: new PropInfo.RampingValue(new RampingValue(0.0, 0.7, -0.7)),
    bulgeSizeY: new PropInfo.RampingValue(new RampingValue(0.0, 0.4, -0.4)),
    bulgeSharpness: new PropInfo.RampingValue(new RampingValue(0.3, 0.35, -0.35)),
    lineXSharpness: new PropInfo.RampingValue(new RampingValue(0.99, -0.99, 0.99)),
    lineYSharpness: new PropInfo.RampingValue(new RampingValue(0.99, -0.15, 0.16)),
  };

  private beamFilter: BeamFilter;
  private seed: number = Math.random() * 100;

  constructor(props: BeamProps)
  {
    super();

    this.initializeProps(props);
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
    this.beamFilter.setUniforms(
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
