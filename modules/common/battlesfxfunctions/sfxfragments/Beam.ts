/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import BeamFilter from "../shaders/Beam";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  createDummySpriteForShader,
  getRelativeValue
} from "../../../../src/utility";

interface PartialBeamProps
{
  size?: Point;
  relativeImpactTime?: number;
  relativeBeamOrigin?: Point;
  color?: Color;
}
interface BeamProps extends PartialBeamProps
{
  size: Point;
  relativeImpactTime: number;
  relativeBeamOrigin: Point;
  color: Color;
}
const defaultBeamProps: BeamProps =
{
  size:
  {
    x: 500,
    y: 500
  },
  relativeImpactTime: 0.2,
  relativeBeamOrigin:
  {
    x: 0,
    y: 0.5
  },
  color: new Color(1, 0.9, 0.9)
}
const BeamPropTypes: SFXFragmentPropTypes =
{
  size: "point",
  relativeImpactTime: "number",
  relativeBeamOrigin: "point",
  color: "color",
}


export default class Beam extends SFXFragment<BeamProps, PartialBeamProps>
{
  public displayName: "Beam";
  public key: "beam";

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

    const rampDownValue = Math.min(Math.pow(relativeTimeAfterImpact * 1.2, 12.0), 1.0);
    const beamIntensity = rampUpValue - rampDownValue;

    this.beamFilter.setUniformValues(
    {
      time: time * 100,
      noiseAmplitude: 0.4 * beamIntensity,
      lineIntensity: 2.0 + 3.0 * beamIntensity,
      bulgeIntensity: 6.0 * beamIntensity,

      bulgeSize:
      [
        0.7 * Math.pow(beamIntensity, 1.5),
        0.4 * Math.pow(beamIntensity, 1.5)
      ],
      bulgeSharpness: 0.3 + 0.35 * beamIntensity,

      lineXSize:
      [
        this.props.relativeBeamOrigin.x * rampUpValue,
        1.0
      ],
      lineXSharpness: 0.99 - beamIntensity * 0.99,

      lineYSize: 0.001 + beamIntensity * 0.03,
      lineYSharpness: 0.99 - beamIntensity * 0.15 + 0.01 * rampDownValue
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
      beamYPosition: this.props.relativeBeamOrigin.y
    });

    const beamSprite = createDummySpriteForShader(
      0,
      0,
      this.props.size.x,
      this.props.size.y
    );
    beamSprite.shader = this.beamFilter;
    beamSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(beamSprite);
  }
}
