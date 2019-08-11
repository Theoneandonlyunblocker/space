import * as PIXI from "pixi.js";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { Point } from "../../../../../src/Point";


interface ProjectileProps<D extends PIXI.DisplayObject>
{
  getDisplayObject: () => D;
  animateProjectile?: (displayObject: D, time: number, x: number, y: number) => void;

  spawnPosition: Point;

  // TODO 2019.08.06 | are these all px/1 ?
  initialVelocity?: number;
  terminalVelocity?: number;
  acceleration?: number;
  decelerationAboveTerminalVelocity?: number; // would be nice to just do damping but calculating thats too hard for me
}

export class Projectile<D extends PIXI.DisplayObject = PIXI.Sprite> extends VfxFragment<ProjectileProps<D>>
{
  public displayName = "Projectile";
  public key = "projectile";

  public readonly propInfo =
  {
    getDisplayObject: new PropInfo.Function(() => <D><any>PIXI.Sprite.from("placeHolder")),
    animateProjectile: new PropInfo.Function(undefined),

    spawnPosition: new PropInfo.Point({x: 0, y: 0}),

    initialVelocity: new PropInfo.Number(0),
    terminalVelocity: new PropInfo.Number(Infinity),
    acceleration: new PropInfo.Number(0),
    decelerationAboveTerminalVelocity: new PropInfo.Number(0),
  }

  constructor(props: ProjectileProps<D>)
  {
    super();

    this.initializeProps(props);
  }

  public animate(time: number): void
  {
    this.displayObject.position.x = this.props.spawnPosition.x + this.getDisplacement(time);
  }
  public draw(): void
  {
    const displayObject = this.props.getDisplayObject();

    displayObject.position.x = this.props.spawnPosition.x;
    displayObject.position.y = this.props.spawnPosition.y - displayObject.getBounds().height / 2;

    this.setDisplayObject(displayObject);
  }
  // i REFUSE to learn high school math. thankfully this should be cheap enough to do
  public getTimeForPosition(targetPosition: number, desiredAccuracy: number): number | undefined
  {
    const initialPosition = this.props.spawnPosition.x;
    const maxIterations = Math.log(1 / desiredAccuracy) * 10;

    let partitionCenter = 0.5;
    let samplingDistance = 0.25;

    for (let i = 0; i < maxIterations; i++)
    {
      const lowerTime = partitionCenter - samplingDistance;
      const upperTime = partitionCenter + samplingDistance;

      const lowerSample = initialPosition + this.getDisplacement(lowerTime);
      const centerSample = initialPosition + this.getDisplacement(partitionCenter);
      const upperSample = initialPosition + this.getDisplacement(upperTime);

      const lowerSampleError = Math.abs(targetPosition - lowerSample);
      const centerSampleError = Math.abs(targetPosition - centerSample);
      const upperSampleError = Math.abs(targetPosition - upperSample);

      if (Math.min(lowerSampleError, upperSampleError) < centerSampleError)
      {
        partitionCenter = lowerSampleError < upperSampleError ?
          partitionCenter - samplingDistance :
          partitionCenter + samplingDistance;
      }

      samplingDistance /= 2;

      if (Math.min(lowerSampleError, upperSampleError, centerSampleError) < desiredAccuracy)
      {
        return partitionCenter;
      }
    }

    return undefined;
  }

  private getDisplacement(time: number): number
  {
    const willDecelerate = this.props.initialVelocity > this.props.terminalVelocity;

    const acceleration = willDecelerate ?
      -1 * this.props.decelerationAboveTerminalVelocity :
      this.props.acceleration;

    if (!acceleration)
    {
      return this.props.initialVelocity * time;
    }

    const timeForTerminalVelocity = Math.abs((this.props.terminalVelocity - this.props.initialVelocity) / acceleration);

    const timeBeforeTerminalVelocity = Math.min(time, timeForTerminalVelocity);
    const displacementFromVelocity = this.props.initialVelocity * timeBeforeTerminalVelocity;
    const displacementFromAcceleration = 0.5 * acceleration * Math.pow(timeBeforeTerminalVelocity, 2.0);

    const displacementBeforeTerminalVelocity = displacementFromVelocity + displacementFromAcceleration;

    if (time <= timeForTerminalVelocity)
    {
      return displacementBeforeTerminalVelocity;
    }
    else
    {
      const timeAfterReachingTerminalVelocity = time - timeForTerminalVelocity;
      const displacementAfterTerminalVelocity = timeAfterReachingTerminalVelocity * this.props.terminalVelocity;

      return displacementBeforeTerminalVelocity + displacementAfterTerminalVelocity;
    }
  }
}
