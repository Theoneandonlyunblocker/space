import {Color} from "core/color/Color";
import {Point} from "core/math/Point";
import
{
  clamp,
  getRelativeValue,
} from "core/generic/utility";

import {Beam} from "./Beam";
import {RampingValue} from "./RampingValue";
import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";


interface FocusingBeamProps
{
  color: Color;
  size: Point;

  focusStartTime: number;
  focusEndTime: number;
  decayStartTime: number;
  decayEndtime: number;
  focusTimeExponent: number;
  relativeYPosition: number;

  beamIntensity: RampingValue;
  beamSharpness: RampingValue;
  beamSize: RampingValue;
}

export class FocusingBeam extends VfxFragment<FocusingBeamProps>
{
  public displayName = "FocusingBeam";
  public key = "focusingBeam";

  public readonly propInfo =
  {
    color: new PropInfo.Color(new Color(1.0, 1.0, 1.0)),
    size: new PropInfo.Point({x: 500, y: 500}),

    focusStartTime: new PropInfo.Number(0.0),
    focusEndTime: new PropInfo.Number(0.3),
    decayStartTime: new PropInfo.Number(0.8),
    decayEndtime: new PropInfo.Number(1.0),
    focusTimeExponent: new PropInfo.Number(0.75),
    relativeYPosition: new PropInfo.Number(0.5),

    beamIntensity: new PropInfo.RampingValue(new RampingValue(5.0, 20.0, -25.0)),
    beamSharpness: new PropInfo.RampingValue(new RampingValue(0.75, 0.24, 0.0)),
    beamSize: new PropInfo.RampingValue(new RampingValue(0.12, -0.115, -0.005)),
  };

  private beamFragment: Beam;

  constructor(props: FocusingBeamProps)
  {
    super();
    this.initializeProps(props);
  }

  public animate(time: number): void
  {
    const relativeFocusTime = Math.pow(getRelativeValue(time, this.props.focusStartTime, this.props.focusEndTime), this.props.focusTimeExponent);
    const rampUpValue = clamp(relativeFocusTime, 0.0, 1.0);

    const relativeDecayTime = getRelativeValue(time, this.props.decayStartTime, this.props.decayEndtime);
    const rampDownValue = clamp(relativeDecayTime, 0.0, 1.0);

    this.beamFragment.animateFromRampValues(time, rampUpValue, rampDownValue);
  }
  public draw(): void
  {
    this.beamFragment = new Beam(
    {
      color: this.props.color,
      size: this.props.size,

      relativeImpactTime: this.props.focusStartTime,
      relativeBeamOrigin:
      {
        x: 0.0,
        y: this.props.relativeYPosition,
      },

      timeScale: 0,
      noiseAmplitude: new RampingValue(0.0),
      lineIntensity: this.props.beamIntensity,
      bulgeIntensity: new RampingValue(0.0),
      bulgeSharpness: new RampingValue(0.0),
      lineYSize: this.props.beamSize,
      bulgeSizeX: new RampingValue(0.0),
      bulgeSizeY: new RampingValue(0.0),
      lineXSharpness: new RampingValue(0.99),
      lineYSharpness: this.props.beamSharpness,

    });

    this.beamFragment.draw();

    this.setDisplayObject(this.beamFragment.displayObject);
  }
}
