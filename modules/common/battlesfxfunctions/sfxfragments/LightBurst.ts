import * as PIXI from "pixi.js";

import Color from "../../../../src/Color";
import Point from "../../../../src/Point";
import
{
  makeShaderSprite,
} from "../../../../src/pixiWrapperFunctions";
import LightBurstFilter from "../shaders/LightBurst";

import SfxFragment from "./SfxFragment";
import * as PropInfo from "./props/PropInfoClasses";


interface LightBurstProps
{
  size: Point;
  delay: number;
  sharpness: number;
  color: Color;
  centerSize: number;
  rayStrength: number;
}

export default class LightBurst extends SfxFragment<LightBurstProps>
{
  public displayName = "LightBurst";
  public key = "lightBurst";

  public readonly propInfo =
  {
    size: new PropInfo.Point({x: 200, y: 200}),
    delay: new PropInfo.Number(0.3),
    sharpness: new PropInfo.Number(2.0),
    color: new PropInfo.Color(new Color(0.75, 0.75, 0.62)),
    centerSize: new PropInfo.Number(1.0),
    rayStrength: new PropInfo.Number(1.0),
  };

  private lightBurstFilter: LightBurstFilter;
  private seed: number[] = [Math.random() * 69, Math.random() * 420];

  constructor(props: LightBurstProps)
  {
    super();
    this.initializeProps(props);
  }

  public animate(time: number): void
  {
    const rampUpValue = Math.pow(Math.min(time / this.props.delay, 1.0), 7.0);

    const timeAfterImpact = Math.max(time - this.props.delay, 0.0);
    const rampDownValue = Math.pow(timeAfterImpact * 5.0, 2.0);

    const lightBurstIntensity = Math.max(rampUpValue - rampDownValue, 0.0);

    this.lightBurstFilter.setUniforms(
    {
      centerSize: Math.pow(lightBurstIntensity, 2.0) * this.props.centerSize,
      centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
      rayStrength: Math.pow(lightBurstIntensity, 3.0) * this.props.rayStrength,
    });
  }
  public draw(): void
  {
    this.lightBurstFilter = new LightBurstFilter(
    {
      seed: this.seed,
      rotation: 0,
      raySharpness: this.props.sharpness,
      rayColor: this.props.color.getRGBA(1.0),
    });

    const lightBurstSprite = makeShaderSprite(
      this.lightBurstFilter,
      0,
      0,
      this.props.size.x,
      this.props.size.y,
    );

    lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.setDisplayObject(lightBurstSprite);
  }
}

