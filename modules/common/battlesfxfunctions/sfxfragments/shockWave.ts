/// <reference path="../../../../lib/tween.js.d.ts" />

import RampingValue from "./RampingValue";
import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import IntersectingEllipsesFilter from "../shaders/IntersectingEllipses";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  makeShaderSprite,
} from "../../../../src/utility";

interface ShockWaveProps
{
  size: Point;
  intersectingEllipseOrigin: Point;
  intersectingEllipseDrift: Point;

  alpha: RampingValue;
  mainEllipseScaleX: RampingValue;
  mainEllipseScaleY: RampingValue;
  mainEllipseSharpness: RampingValue;
  intersectingEllipseScaleX: RampingValue;
  intersectingEllipseScaleY: RampingValue;
  intersectingEllipseSharpness: RampingValue;

  color: Color;

  delay: number;
}
const defaultShockWaveProps: ShockWaveProps =
{
  size: {x: 200, y: 200},
  intersectingEllipseOrigin: {x: 0.0, y: 0.0},
  intersectingEllipseDrift: {x: 0.0, y: 0.0},

  alpha: new RampingValue(1.0, -1.0, 0.0),
  mainEllipseScaleX: new RampingValue(0.0, 0.9, 0.0),
  mainEllipseScaleY: new RampingValue(0.0, 0.9, 0.0),
  mainEllipseSharpness: new RampingValue(1.0, -0.2, 0.0),
  intersectingEllipseScaleX: new RampingValue(0.0, 1.0, 0.0),
  intersectingEllipseScaleY: new RampingValue(0.0, 1.0, 0.0),
  intersectingEllipseSharpness: new RampingValue(0.8, -0.4, 0.0),

  color: new Color(1, 1, 1),

  delay: 0.3,
}
const shockWavePropTypes: SFXFragmentPropTypes =
{
  size: "point",
  intersectingEllipseOrigin: "point",
  intersectingEllipseDrift: "point",

  alpha: "rampingValue",
  mainEllipseScaleX: "rampingValue",
  mainEllipseScaleY: "rampingValue",
  mainEllipseSharpness: "rampingValue",
  intersectingEllipseScaleX: "rampingValue",
  intersectingEllipseScaleY: "rampingValue",
  intersectingEllipseSharpness: "rampingValue",

  color: "color",

  delay: "number",
}

export default class ShockWave extends SFXFragment<ShockWaveProps>
{
  public displayName = "ShockWave";
  public key = "shockWave";

  private shockWaveFilter: IntersectingEllipsesFilter;

  constructor(props: ShockWaveProps)
  {
    super(shockWavePropTypes, defaultShockWaveProps, props);
  }
  public static CreateFromPartialProps(props?: Partial<ShockWaveProps>): ShockWave
  {
    return new ShockWave(<ShockWaveProps>props);
  }

  public animate(time: number): void
  {
    const p = this.props;

    const burstX = time < p.delay - 0.02 ?
      0 :
      time - (p.delay - 0.02);

    const shockWaveTime = TWEEN.Easing.Quintic.Out(burstX);

    this.shockWaveFilter.setUniformValues(
    {
      mainEllipseSize:
      [
        p.mainEllipseScaleX.getValue(shockWaveTime),
        p.mainEllipseScaleY.getValue(shockWaveTime),
      ],
      intersectingEllipseSize:
      [
        p.intersectingEllipseScaleX.getValue(shockWaveTime),
        p.intersectingEllipseScaleY.getValue(shockWaveTime),
      ],
      intersectingEllipseCenter:
      [
        p.intersectingEllipseOrigin.x + p.intersectingEllipseDrift.x * shockWaveTime,
        p.intersectingEllipseOrigin.y + p.intersectingEllipseDrift.y * shockWaveTime,
      ],
      mainEllipseSharpness: p.mainEllipseSharpness.getValue(shockWaveTime),
      intersectingEllipseSharpness: p.intersectingEllipseSharpness.getValue(shockWaveTime),
      mainAlpha: p.alpha.getValue(shockWaveTime),
    });
  }
  public draw(): void
  {
    const shockWaveFilter = this.shockWaveFilter = new IntersectingEllipsesFilter(
    {
      mainColor: this.props.color.getRGBA(1.0),
    });

    const shockWaveSprite = makeShaderSprite(
      shockWaveFilter,
      0,
      0,
      this.props.size.x,
      this.props.size.y,
    );

    this.setDisplayObject(shockWaveSprite);
  }
}
