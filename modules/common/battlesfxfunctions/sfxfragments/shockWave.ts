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
  
  mainEllipseMaxSize: Point;
  intersectingEllipseMaxSize: Point;

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

    var shockWaveSize = TWEEN.Easing.Quintic.Out(burstX);

    shockWaveFilter.setUniformValues(
    {
      mainEllipseSize:
      [
        props.mainEllipseMaxSize.x * shockWaveSize,
        props.mainEllipseMaxSize.y * shockWaveSize
      ],
      intersectingEllipseSize:
      [
        props.intersectingEllipseMaxSize.x * shockWaveSize,
        props.intersectingEllipseMaxSize.y * shockWaveSize
      ],
      intersectingEllipseCenter:
      [
        0.05 + 0.3 * shockWaveSize,
        0.0
      ],
      mainEllipseSharpness: 0.8 + 0.18 * (1.0 - shockWaveSize),
      intersectingEllipseSharpness: 0.4 + 0.4 * (1.0 - shockWaveSize),
      mainAlpha: 1.0 - shockWaveSize
    });
  }


  const shockWaveSpriteSize =
  {
    x: params.height * 3.0,
    y: params.height * 3.0
  }
  const shockWaveSprite = createDummySpriteForShader(
    props.origin.x - (shockWaveSpriteSize.x / 2 * 1.04),
    props.origin.y - shockWaveSpriteSize.y / 2,
    shockWaveSpriteSize.x,
    shockWaveSpriteSize.y
  );
  shockWaveSprite.shader = shockWaveFilter;

  return(
  {
    displayObject: shockWaveSprite,
    animate: animate
  });
}