/// <reference path="../../../../lib/tween.js.d.ts" />

import SFXFragment from "./SFXFragment";

import IntersectingEllipsesFilter from "../shaders/IntersectingEllipses";

import SFXParams from "../../../../src/templateinterfaces/SFXParams";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  createDummySpriteForShader
} from "../../../../src/utility";


interface ShockWaveProps
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

export default function shockWave(
  params: SFXParams,
  props: ShockWaveProps
): SFXFragment
{
  const shockWaveFilter = new IntersectingEllipsesFilter(
  {
    mainColor: props.color.getRGBA(1.0)
  });

  const animate = function(time: number)
  {
    var burstX: number;

    if (time < (props.relativeImpactTime - 0.02))
    {
      burstX = 0;
    }
    else
    {
      burstX = time - (props.relativeImpactTime - 0.02);
    }

    const shockWaveTime = TWEEN.Easing.Quintic.Out(burstX);

    shockWaveFilter.setUniformValues(
    {
      mainEllipseSize:
      [
        props.mainEllipseMaxScale.x * shockWaveTime,
        props.mainEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseSize:
      [
        props.intersectingEllipseMaxScale.x * shockWaveTime,
        props.intersectingEllipseMaxScale.y * shockWaveTime
      ],
      intersectingEllipseCenter:
      [
        props.intersectingEllipseOrigin.x + props.intersectingEllipseDrift.x * shockWaveTime,
        props.intersectingEllipseOrigin.y + props.intersectingEllipseDrift.y * shockWaveTime
      ],
      mainEllipseSharpness: 0.8 + 0.18 * (1.0 - shockWaveTime),
      intersectingEllipseSharpness: 0.4 + 0.4 * (1.0 - shockWaveTime),
      mainAlpha: 1.0 - shockWaveTime
    });
  }



  const shockWaveSprite = createDummySpriteForShader(
    props.origin.x - (props.size.x / 2),
    props.origin.y - props.size.y / 2,
    props.size.x,
    props.size.y
  );
  shockWaveSprite.shader = shockWaveFilter;

  return(
  {
    displayObject: shockWaveSprite,
    animate: animate
  });
}