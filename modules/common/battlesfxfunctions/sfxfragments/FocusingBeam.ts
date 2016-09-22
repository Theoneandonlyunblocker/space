import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import Beam from "./Beam";
import RampingValue from "./RampingValue";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import Range from "../../../../src/Range";
import
{
  getRelativeValue,
  clamp
} from "../../../../src/utility";

interface PartialFocusingBeamProps
{
  color?: Color;
  size?: Point;
  
  focusStartTime?: number;
  focusEndTime?: number;
  focusTimeExponent?: number;
  relativeYPosition?: number;

  beamIntensity?: RampingValue;
  beamSharpness?: RampingValue;
  beamSize?: RampingValue;
}
interface FocusingBeamProps extends PartialFocusingBeamProps
{
  color: Color;
  size: Point;
  
  focusStartTime: number;
  focusEndTime: number;
  focusTimeExponent: number;
  relativeYPosition: number;

  beamIntensity: RampingValue;
  beamSharpness: RampingValue;
  beamSize: RampingValue;
}
const defaultFocusingBeamProps: FocusingBeamProps =
{
  color: new Color(1.0, 1.0, 1.0),
  size: {x: 500, y: 500},
  
  focusStartTime: 0.0,
  focusEndTime: 0.3,
  focusTimeExponent: 0.75,
  relativeYPosition: 0.5,

  beamIntensity: new RampingValue(5.0, 20.0, 0.0),
  beamSharpness: new RampingValue(0.75, 0.24, 0.0),
  beamSize: new RampingValue(0.12, -0.115, 0.0),
}
const FocusingBeamPropTypes: SFXFragmentPropTypes =
{
  color: "color",
  size: "point",
  
  focusStartTime: "number",
  focusEndTime: "number",
  focusTimeExponent: "number",
  relativeYPosition: "number",

  beamIntensity: "rampingValue",
  beamSharpness: "rampingValue",
  beamSize: "rampingValue",
}


export default class FocusingBeam extends SFXFragment<FocusingBeamProps, PartialFocusingBeamProps>
{
  public displayName = "FocusingBeam";
  public key = "focusingBeam";

  private beamFragment: Beam;

  constructor(props: FocusingBeamProps)
  {
    super(FocusingBeamPropTypes, defaultFocusingBeamProps, props);
  }
  
  public animate(time: number): void
  {
    const relativeFocusTime = Math.pow(getRelativeValue(time, this.props.focusStartTime, this.props.focusEndTime), this.props.focusTimeExponent);
    const rampUpValue = clamp(relativeFocusTime, 0.0, 1.0);
    this.beamFragment.animateFromRampValues(time, rampUpValue, 0.0);
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
      lineYSharpness: this.props.beamSharpness
      
    });

    this.beamFragment.draw();

    this.setDisplayObject(this.beamFragment.displayObject);
  }
}
