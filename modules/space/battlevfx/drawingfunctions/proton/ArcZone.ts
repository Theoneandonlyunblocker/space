import * as Proton from "proton-js";
import * as PIXI from "pixi.js";

import { PixiParticle } from "./PixiParticle";
import { Point } from "core/math/Point";
import { randRange, getDistanceBetweenPoints, getAngleBetweenPoints } from "core/generic/utility";


export class ArcZone<T extends Proton.Particle = PixiParticle> extends Proton.Zone<T>
{
  public x: number;
  public y: number;
  public heading: number; // rad
  public angle: number; // rad
  public innerRadius: number;
  public outerRadius: number;

  constructor(
    x: number,
    y: number,
    headingInDeg: number,
    angleInDeg: number,
    outerRadius: number,
    innerRadius: number = 0,
  )
  {
    super();

    this.x = x;
    this.y = y;
    this.heading = headingInDeg * Proton.MathUtils.PI_180;
    this.angle = angleInDeg * Proton.MathUtils.PI_180;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
  }

  public static getDistanceToFurthestPointOnCanvas(
    origin: Point,
    canvasWidth: number,
    canvasHeight: number,
    headingInDeg: number,
    angleInDeg: number,
  ): number
  {
    const heading =  headingInDeg * Proton.MathUtils.PI_180;
    const angle = angleInDeg * Proton.MathUtils.PI_180;

    const cornerPoints: Point[] =
    [
      {x: canvasWidth,  y: canvasHeight}, // br
      {x: 0,            y: canvasHeight}, // bl
      {x: 0,            y: 0},            // tl
      {x: canvasWidth,  y: 0},            // tr
    ];
    const cornerPointsWithinArc = cornerPoints.filter(point =>
    {
      return ArcZone.pointIsWithinArc(point, origin, headingInDeg, angleInDeg);
    });

    const inArcCornerPointDistances = cornerPointsWithinArc.map(cornerPoint => getDistanceBetweenPoints(origin, cornerPoint));

    if (cornerPointsWithinArc.length === 4)
    {

      return inArcCornerPointDistances.sort((a, b) => b - a)[0];
    }

    const cornerPointAngles = cornerPoints.map(cornerPoint =>
    {
      return getAngleBetweenPoints(cornerPoint, origin);
    });

    function getIntersectingBorderForAngle(angleToCheck: number): "bottom" | "left" | "top" | "right"
    {
      // bottom
      if (angleToCheck >= cornerPointAngles[0] && angleToCheck <= cornerPointAngles[1])
      {
        return "bottom";
      }
      // left
      else if (angleToCheck >= cornerPointAngles[1] && angleToCheck <= cornerPointAngles[2])
      {
        return "left";
      }
      // top
      else if (angleToCheck >= cornerPointAngles[2] && angleToCheck <= cornerPointAngles[3])
      {
        return "top";
      }
      // right
      else
      {
        return "right";
      }
    }
    function getDistanceToBorder(border: "bottom" | "left" | "top" | "right"): number
    {
      switch (border)
      {
        case "bottom": return canvasHeight - origin.y;
        case "left":   return origin.x;
        case "top":    return origin.y;
        case "right":  return canvasWidth - origin.y;
      }
    }
    function getAngleToBorder(border: "bottom" | "left" | "top" | "right", angleToRight: number): number
    {
      switch (border)
      {
        case "bottom": return angleToRight + 90 * Math.PI / 180;
        case "left":   return angleToRight + 180 * Math.PI / 180;
        case "top":    return angleToRight - 90 * Math.PI / 180;
        case "right":  return angleToRight;
      }
    }

    const extremeAngles = this.headingToMinAndMaxAngle(heading, angle);
    const extremeAngleDistances = [extremeAngles.min, extremeAngles.max].map(extremeAngle =>
    {
      const intersectingBorder = getIntersectingBorderForAngle(extremeAngle);
      const distanceToBorder = getDistanceToBorder(intersectingBorder);
      const angleToBorder = getAngleToBorder(intersectingBorder, extremeAngle);

      return Math.abs(distanceToBorder / Math.cos(angleToBorder));
    });

    const allExtremeDistances = [...inArcCornerPointDistances, ...extremeAngleDistances];

    return allExtremeDistances.sort((a, b) => b - a)[0];
  }
  public static pointIsWithinArc(
    pointToCheck: Point,
    origin: Point,
    headingInDeg: number,
    angleInDeg: number,
  ): boolean
  {
    const heading = headingInDeg * Proton.MathUtils.PI_180;
    const angle = angleInDeg * Proton.MathUtils.PI_180;

    const allowedAngles = ArcZone.headingToMinAndMaxAngle(heading, angle);
    const angleToPoint = getAngleBetweenPoints(pointToCheck, origin);

    return angleToPoint >= allowedAngles.min && angleToPoint <= allowedAngles.max;
  }

  public crossing(particle: T): void
  {
    throw new Error("ArcZone doesn't support collision checks.");
  }
  public getPosition(): Proton.Vector2D
  {
    const possibleAngles = ArcZone.headingToMinAndMaxAngle(this.heading, this.angle);
    const angle = randRange(possibleAngles.min, possibleAngles.max);
    const distance = randRange(this.innerRadius, this.outerRadius);

    this.vector.x = this.x + distance * Math.cos(angle);
    this.vector.y = this.y + distance * Math.sin(angle);

    return this.vector;
  }
  public draw(): PIXI.Container
  {
    const container = new PIXI.Container();

    const angle = ArcZone.headingToMinAndMaxAngle(this.heading, this.angle);

    const arc = new PIXI.Graphics();
    arc.lineStyle(this.outerRadius - this.innerRadius, 0xff0000, 0.5, 0);
    arc.arc(this.x, this.y, this.outerRadius, angle.min, angle.max);

    container.addChild(arc);

    return container;
  }

  private static headingToMinAndMaxAngle(
    heading: number, // rad
    angle: number, // rad
  ): {min: number; max: number}
  {
    return(
    {
      min: heading - angle / 2,
      max: heading + angle / 2,
    });
  }
}
