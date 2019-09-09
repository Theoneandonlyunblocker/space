import * as PIXI from "pixi.js";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { Point } from "core/src/math/Point";
import { TilingRope } from "core/src/graphics/pixiWrapperFunctions";


interface WavyLineProps
{
  getTexture: () => PIXI.Texture;
  originPoint: Point;
  endPositionX: number;

  getLineEndRelativePosition?: (relativeTime: number, lineLength?: number) => number;
  getYBaseSway?: (relativeTime: number, relativePositionInLine: number) => number;
  getSwayFactor?: (relativeTime: number, relativePositionInLine: number) => number;
  smoothness?: number;
}

export class WavyLine extends VfxFragment<WavyLineProps>
{
  public displayName = "WavyLine";
  public key = "wavyLine";

  public readonly propInfo =
  {
    getTexture: new PropInfo.Function(() => PIXI.Texture.from("placeHolder")),
    originPoint: new PropInfo.Point({x: 50, y: 200}),
    endPositionX: new PropInfo.Number(350),

    getLineEndRelativePosition: new PropInfo.Function((time: number) => time),
    getYBaseSway: new PropInfo.Function((relativeTime: number, relativePositionInLine: number) =>
    {
      const timeScale = 40;
      const maxSway = 10;
      const waveFrequency = 20;

      return Math.sin(relativePositionInLine * waveFrequency + relativeTime * timeScale) * maxSway;
    }),
    getSwayFactor: new PropInfo.Function((time: number, relativePositionInLine: number) =>
    {
      const relativeDistanceFromCenter = Math.abs(0.5 - relativePositionInLine) * 2;
      const closenessToCenter = 1 - relativeDistanceFromCenter;

      return closenessToCenter * time;
    }),
    smoothness: new PropInfo.Number(1),
  };

  private container: PIXI.Container;
  private ropeTexture: PIXI.Texture;

  private ropeLength: number;
  private ropeSegmentsCount: number;
  private ropePoints: PIXI.Point[] = [];

  private rope: TilingRope;

  constructor(props: WavyLineProps)
  {
    super();

    this.initializeProps(props);
  }

  public animate(time: number): void
  {
    const lineEndPosition = this.props.getLineEndRelativePosition(time, this.ropeLength) * this.ropeLength;
    const originX = this.props.originPoint.x;
    const originY = this.props.originPoint.y;

    this.ropePoints.forEach((point, i) =>
    {
      const relativePositionInLine = i / (this.ropeSegmentsCount - 1);

      const yFromSway = this.props.getYBaseSway(time, relativePositionInLine);
      const swayFactor = this.props.getSwayFactor(time, relativePositionInLine);

      point.x = originX + lineEndPosition * relativePositionInLine;
      point.y = originY + yFromSway * swayFactor;
    });
  }
  public draw(): void
  {
    this.container = new PIXI.Container();
    this.ropeTexture = this.props.getTexture();

    this.ropeLength = this.props.endPositionX - this.props.originPoint.x;
    this.ropeSegmentsCount = Math.max((this.ropeLength / 10) * this.props.smoothness, 2);

    for (let i = 0; i < this.ropeSegmentsCount; i++)
    {
      this.ropePoints.push(new PIXI.Point(this.props.originPoint.x, this.props.originPoint.y));
    }

    this.rope = new TilingRope(this.ropeTexture, this.ropePoints, this.ropeLength / 2);
    this.container.addChild(this.rope);

    this.setDisplayObject(this.container);
  }
}
