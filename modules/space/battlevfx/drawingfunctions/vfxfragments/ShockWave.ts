import * as TWEEN from "@tweenjs/tween.js";

import {Color} from "core/color/Color";
import {Point} from "core/math/Point";
import
{
  makeShaderSprite,
} from "core/graphics/pixiWrapperFunctions";
import {IntersectingEllipsesShader} from "../shaders/IntersectingEllipsesShader";

import {RampingValue} from "./RampingValue";
import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";


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
}

export class ShockWave extends VfxFragment<ShockWaveProps>
{
  public displayName = "ShockWave";
  public key = "shockWave";

  public readonly propInfo =
  {
    size: new PropInfo.Point({x: 200, y: 200}),
    intersectingEllipseOrigin: new PropInfo.Point({x: 0.0, y: 0.0}),
    intersectingEllipseDrift: new PropInfo.Point({x: 0.0, y: 0.0}),

    alpha: new PropInfo.RampingValue(new RampingValue(1.0, -1.0, 0.0)),
    mainEllipseScaleX: new PropInfo.RampingValue(new RampingValue(0.0, 1.0, 0.0)),
    mainEllipseScaleY: new PropInfo.RampingValue(new RampingValue(0.0, 1.0, 0.0)),
    mainEllipseSharpness: new PropInfo.RampingValue(new RampingValue(1.0, -0.2, 0.0)),
    intersectingEllipseScaleX: new PropInfo.RampingValue(new RampingValue(0.0, 1.0, 0.0)),
    intersectingEllipseScaleY: new PropInfo.RampingValue(new RampingValue(0.0, 1.0, 0.0)),
    intersectingEllipseSharpness: new PropInfo.RampingValue(new RampingValue(0.8, -0.4, 0.0)),

    color: new PropInfo.Color(new Color(1, 1, 1)),
  };

  private shockWaveShader: IntersectingEllipsesShader;

  constructor(props: ShockWaveProps)
  {
    super();
    this.initializeProps(props);
  }
  public static CreateFromPartialProps(props?: Partial<ShockWaveProps>): ShockWave
  {
    return new ShockWave(<ShockWaveProps>props);
  }

  public animate(time: number): void
  {
    const p = this.props;

    const shockWaveTime = TWEEN.Easing.Quintic.Out(time);

    this.shockWaveShader.setUniforms(
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
    const shockWaveShader = this.shockWaveShader = new IntersectingEllipsesShader(
    {
      mainColor: this.props.color.getRGBA(1.0),
    });

    const shockWaveSprite = makeShaderSprite(
      shockWaveShader,
      0,
      0,
      this.props.size.x * 1.5,
      this.props.size.y * 1.5,
    );

    this.setDisplayObject(shockWaveSprite);
  }
}
