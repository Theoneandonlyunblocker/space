import * as PIXI from "pixi.js";

import {Color} from "../../../../../src/color/Color";
import {Point} from "../../../../../src/math/Point";
import
{
  makeShaderSprite,
} from "../../../../../src/graphics/pixiWrapperFunctions";
import {LightBurstShader} from "../shaders/LightBurstShader";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { getRelativeValue } from "../../../../../src/generic/utility";


interface LightBurstProps
{
  size: Point;
  peakTime: number;
  sharpness: number;
  color: Color;
  centerSize: number;
  rayStrength: number;
}

export class LightBurst extends VfxFragment<LightBurstProps>
{
  public displayName = "LightBurst";
  public key = "lightBurst";

  public readonly propInfo =
  {
    size: new PropInfo.Point({x: 200, y: 200}),
    peakTime: new PropInfo.Number(0.3),
    sharpness: new PropInfo.Number(2.0),
    color: new PropInfo.Color(new Color(0.75, 0.75, 0.62)),
    centerSize: new PropInfo.Number(1.0),
    rayStrength: new PropInfo.Number(1.0),
  };

  private lightBurstShader: LightBurstShader;
  private seed: number[] = [Math.random() * 69, Math.random() * 420];

  constructor(props: LightBurstProps)
  {
    super();
    this.initializeProps(props);
  }

  public static getRelativePeakTime(peakInParentTime: number, startInParentTime: number, endInParentTime: number): number
  {
    return getRelativeValue(peakInParentTime, startInParentTime, endInParentTime);
  }

  public animate(time: number): void
  {
    const relativeTimeToPeak = getRelativeValue(time, 0, this.props.peakTime);
    const relativeTimeSincePeak = getRelativeValue(time, this.props.peakTime, 1);

    const rampUpValue = Math.pow(Math.min(relativeTimeToPeak, 1), 7.0);
    const rampDownValue = Math.pow(Math.max(relativeTimeSincePeak, 0), 2.0);

    const lightBurstIntensity = Math.max(rampUpValue - rampDownValue, 0.0);

    this.lightBurstShader.setUniforms(
    {
      centerSize: Math.pow(lightBurstIntensity, 2.0) * this.props.centerSize,
      centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
      rayStrength: Math.pow(lightBurstIntensity, 3.0) * this.props.rayStrength,
    });
  }
  public draw(): void
  {
    this.lightBurstShader = new LightBurstShader(
    {
      seed: this.seed,
      rotation: 0,
      raySharpness: this.props.sharpness,
      rayColor: this.props.color.getRGBA(1.0),
    });

    const lightBurstSprite = makeShaderSprite(
      this.lightBurstShader,
      0,
      0,
      this.props.size.x,
      this.props.size.y,
    );

    lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(lightBurstSprite);
  }
}

