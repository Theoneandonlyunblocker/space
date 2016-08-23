/// <reference path="../../../../lib/tween.js.d.ts" />

import SFXFragment from "./SFXFragment";
import
{
  SFXFragmentNumberProp,
  SFXFragmentPointProp,
  SFXFragmentColorProp,
  SFXFragmentPropTypes,
} from "./SFXFragmentPropTypes";

import IntersectingEllipsesFilter from "../shaders/IntersectingEllipses";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  createDummySpriteForShader
} from "../../../../src/utility";

interface PartialShockWaveProps
{
  origin?: Point;
  size?: Point;
  
  mainEllipseMaxScale?: Point;
  mainEllipseSharpness?: number;
  mainEllipseSharpnessDrift?: number;
  
  intersectingEllipseMaxScale?: Point;
  intersectingEllipseOrigin?: Point;
  intersectingEllipseDrift?: Point;

  color?: Color;

  relativeImpactTime?: number;
}
interface ShockWaveProps extends PartialShockWaveProps
{
  origin: Point;
  size: Point;
  
  mainEllipseMaxScale: Point;
  mainEllipseSharpness: number;
  mainEllipseSharpnessDrift: number;
  
  intersectingEllipseMaxScale: Point;
  intersectingEllipseOrigin: Point;
  intersectingEllipseDrift: Point;

  color: Color;

  relativeImpactTime: number;
}
const shockWavePropTypes: SFXFragmentPropTypes =
{
  origin:
  {
    type: "point",
    defaultValue: {x: 0.5, y: 0.5}
  },
  size:
  {
    type: "point",
    defaultValue: {x: 200, y: 200}
  },
  
  mainEllipseMaxScale:
  {
    type: "point",
    defaultValue: {x: 0.9, y: 0.9}
  },
  mainEllipseSharpness:
  {
    type: "number",
    defaultValue: 1,
  },
  mainEllipseSharpnessDrift:
  {
    type: "number",
    defaultValue: 1
  },
  
  intersectingEllipseMaxScale:
  {
    type: "point",
    defaultValue: {x: 1.0, y: 1.0}
  },
  intersectingEllipseOrigin:
  {
    type: "point",
    defaultValue: {x: 0.0, y: 0.0}
  },
  intersectingEllipseDrift:
  {
    type: "point",
    defaultValue: {x: 0.0, y: 0.0}
  },

  color:
  {
    type: "color",
    defaultValue: new Color(1, 1, 1)
  },

  relativeImpactTime:
  {
    type: "number",
    defaultValue: 0.3
  },
}

export default class ShockWave extends SFXFragment<ShockWaveProps, PartialShockWaveProps>
{
  private shockWaveFilter: IntersectingEllipsesFilter;
  
  constructor(props: ShockWaveProps)
  {
    super(shockWavePropTypes, props);
  }
  public static CreatePartial(props: PartialShockWaveProps): ShockWave
  {
    return new ShockWave(<ShockWaveProps>props);
  }

  public animate(time: number): void
  {
    const burstX = time < this.props.relativeImpactTime - 0.02 ?
      0 :
      time - (this.props.relativeImpactTime - 0.02);

    const shockWaveTime = TWEEN.Easing.Quintic.Out(burstX);

    this.shockWaveFilter.setUniformValues(
    {
      mainEllipseSize:
      [
        this.props.mainEllipseMaxScale.x * shockWaveTime,
        this.props.mainEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseSize:
      [
        this.props.intersectingEllipseMaxScale.x * shockWaveTime,
        this.props.intersectingEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseCenter:
      [
        this.props.intersectingEllipseOrigin.x + this.props.intersectingEllipseDrift.x * shockWaveTime,
        this.props.intersectingEllipseOrigin.y + this.props.intersectingEllipseDrift.y * shockWaveTime
      ],
      mainEllipseSharpness: 0.8 + 0.18 * (1.0 - shockWaveTime),
      intersectingEllipseSharpness: 0.4 + 0.4 * (1.0 - shockWaveTime),
      mainAlpha: 1.0 - shockWaveTime
    });
  }
  protected draw(): void
  {
    const shockWaveFilter = this.shockWaveFilter = new IntersectingEllipsesFilter(
    {
      mainColor: this.props.color.getRGBA(1.0)
    });

    const shockWaveSprite = createDummySpriteForShader(
      this.props.origin.x - (this.props.size.x / 2),
      this.props.origin.y - this.props.size.y / 2,
      this.props.size.x,
      this.props.size.y
    );

    shockWaveSprite.shader = shockWaveFilter;

    this.setDisplayObject(shockWaveSprite);
  }
}