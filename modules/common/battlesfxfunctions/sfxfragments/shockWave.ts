/// <reference path="../../../../lib/tween.js.d.ts" />

import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import IntersectingEllipsesFilter from "../shaders/IntersectingEllipses";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  createDummySpriteForShader
} from "../../../../src/utility";

interface PartialShockWaveProps
{
  size?: Point;
  
  mainEllipseMaxScale?: Point;
  mainEllipseSharpness?: number;
  mainEllipseSharpnessDrift?: number;
  
  intersectingEllipseMaxScale?: Point;
  intersectingEllipseOrigin?: Point;
  intersectingEllipseDrift?: Point;

  color?: Color;

  delay?: number;
}
interface ShockWaveProps extends PartialShockWaveProps
{
  size: Point;
  
  mainEllipseMaxScale: Point;
  mainEllipseSharpness: number;
  mainEllipseSharpnessDrift: number;
  intersectingEllipseSharpness: number;
  intersectingEllipseSharpnessDrift: number;
  
  intersectingEllipseMaxScale: Point;
  intersectingEllipseOrigin: Point;
  intersectingEllipseDrift: Point;

  color: Color;

  delay: number;
}
const defaultShockWaveProps: ShockWaveProps =
{
  size: {x: 200, y: 200},
  mainEllipseMaxScale: {x: 0.9, y: 0.9},
  mainEllipseSharpness: 1,
  mainEllipseSharpnessDrift: -0.2,
  intersectingEllipseSharpness: 0.8,
  intersectingEllipseSharpnessDrift: -0.4,
  intersectingEllipseMaxScale: {x: 1.0, y: 1.0},
  intersectingEllipseOrigin: {x: 0.0, y: 0.0},
  intersectingEllipseDrift: {x: 0.0, y: 0.0},
  color: new Color(1, 1, 1),
  delay: 0.3,
}
const shockWavePropTypes: SFXFragmentPropTypes =
{
  size: "point",
  mainEllipseMaxScale: "point",
  mainEllipseSharpness: "number",
  mainEllipseSharpnessDrift: "number",
  intersectingEllipseSharpness: "number",
  intersectingEllipseSharpnessDrift: "number",
  intersectingEllipseMaxScale: "point",
  intersectingEllipseOrigin: "point",
  intersectingEllipseDrift: "point",
  color: "color",
  delay: "number",
}

export default class ShockWave extends SFXFragment<ShockWaveProps, PartialShockWaveProps>
{
  public key: "shockWave";
  
  private shockWaveFilter: IntersectingEllipsesFilter;
  
  constructor(props: ShockWaveProps)
  {
    super(shockWavePropTypes, defaultShockWaveProps, props);
  }
  public static CreateFromPartialProps(props?: PartialShockWaveProps): ShockWave
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
        p.mainEllipseMaxScale.x * shockWaveTime,
        p.mainEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseSize:
      [
        p.intersectingEllipseMaxScale.x * shockWaveTime,
        p.intersectingEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseCenter:
      [
        p.intersectingEllipseOrigin.x + p.intersectingEllipseDrift.x * shockWaveTime,
        p.intersectingEllipseOrigin.y + p.intersectingEllipseDrift.y * shockWaveTime
      ],
      mainEllipseSharpness: p.mainEllipseSharpness + p.mainEllipseSharpnessDrift * shockWaveTime,
      intersectingEllipseSharpness:
        p.intersectingEllipseSharpness + p.intersectingEllipseSharpnessDrift * shockWaveTime,
      mainAlpha: 1.0 - shockWaveTime
    });
  }
  public draw(): void
  {
    const shockWaveFilter = this.shockWaveFilter = new IntersectingEllipsesFilter(
    {
      mainColor: this.props.color.getRGBA(1.0)
    });

    const shockWaveSprite = createDummySpriteForShader(
      0,
      0,
      this.props.size.x,
      this.props.size.y
    );

    shockWaveSprite.shader = shockWaveFilter;

    this.setDisplayObject(shockWaveSprite);
  }
}
