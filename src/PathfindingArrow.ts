import * as PIXI from "pixi.js";

import {app} from "./App"; // TODO global

import {Color} from "./Color";
import {Fleet} from "./Fleet";
import {Point} from "./Point";
import {Star} from "./Star";
import {eventManager} from "./eventManager";


interface PathfindingArrowCurveStyle
{
  color: Color;
}

// cp = control point, dp = destination point
/**
 *                    cp1.x,  cp1.y,  cp2.x,  cp2.y,   dp.x,   dp.y
 */
type CurveSegment = [number, number, number, number, number, number];

// TODO 2018.05.30 | curve calculation stuff should be in a different module
export class PathfindingArrow
{
  parentContainer: PIXI.Container;
  container: PIXI.Container;
  active: boolean;
  currentTarget: Star;

  clearTargetTimeout: any;

  selectedFleets: Fleet[] = [];

  labelCache:
  {
    [style: string]:
    {
      [distance: number]: PIXI.Text;
    };
  } = {};
  listeners:
  {
    [name: string]: any;
  } = {};

  private curveStyles =
  {
    reachable: <PathfindingArrowCurveStyle>
    {
      color: Color.fromHex(0xFFFFF0),
    },
    unreachable: <PathfindingArrowCurveStyle>
    {
      color: Color.fromHex(0xFF0000),
    },
  };

  constructor(parentContainer: PIXI.Container)
  {
    this.parentContainer = parentContainer;
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);

    this.addEventListeners();
  }
  destroy()
  {
    this.active = false;

    this.removeEventListeners();

    this.parentContainer = null;
    this.container = null;
    this.currentTarget = null;

    window.clearTimeout(this.clearTargetTimeout);
    this.selectedFleets = null;
    this.labelCache = null;
  }
  removeEventListener(name: string)
  {
    eventManager.removeEventListener(name, this.listeners[name]);
  }
  removeEventListeners()
  {
    for (const name in this.listeners)
    {
      this.removeEventListener(name);
    }
  }
  addEventListener(name: string, handler: (...args: any[]) => void)
  {
    this.listeners[name] = handler;

    eventManager.addEventListener(name, handler);
  }
  addEventListeners()
  {
    this.addEventListener("startPotentialMove", () =>
    {
      this.startMove();
    });
    this.addEventListener("setPotentialMoveTarget", (star: Star) =>
    {
      this.setTarget(star);
    });
    this.addEventListener("clearPotentialMoveTarget", () =>
    {
      this.clearTarget();
    });
    this.addEventListener("endPotentialMove", () =>
    {
      this.endMove();
    });
  }

  startMove()
  {
    const fleets = app.playerControl.selectedFleets;

    if (this.active || !fleets || fleets.length < 1)
    {
      return;
    }

    this.active = true;
    this.currentTarget = null;
    this.selectedFleets = fleets;
    this.clearArrows();
  }

  setTarget(star: Star)
  {
    if (!this.active)
    {
      return;
    }

    if (this.clearTargetTimeout)
    {
      window.clearTimeout(this.clearTargetTimeout);
    }

    this.currentTarget = star;
    window.setTimeout(this.drawAllCurrentCurves.bind(this), 10);
    // this.drawAllCurrentCurves();
  }

  clearTarget()
  {
    if (!this.active)
    {
      return;
    }
    if (this.clearTargetTimeout)
    {
      window.clearTimeout(this.clearTargetTimeout);
    }

    this.clearTargetTimeout = window.setTimeout(() =>
    {
      this.currentTarget = null;
      this.clearArrows();
      this.clearTargetTimeout = null;
    }, 10);
  }

  endMove()
  {
    this.active = false;
    this.currentTarget = null;
    this.selectedFleets = [];
    this.clearArrows();
  }

  clearArrows()
  {
    this.container.removeChildren();
  }

  makeLabel(style: string, distance: number)
  {
    let textStyle: Partial<PIXI.TextStyle>;

    switch (style)
    {
      case "reachable":
      {
        textStyle =
        {
          fill: 0xFFFFF0,
        };
        break;
      }
      case "unreachable":
      {
        textStyle =
        {
          fill: 0xFF0000,
        };
        break;
      }
    }

    if (!this.labelCache[style])
    {
      this.labelCache[style] = {};
    }

    this.labelCache[style][distance] = new PIXI.Text("" + distance, textStyle);
  }

  getLabel(style: string, distance: number)
  {
    if (!this.labelCache[style] || !this.labelCache[style][distance])
    {
      this.makeLabel(style, distance);
    }

    return this.labelCache[style][distance];
  }

  getAllCurrentPaths()
  {
    const paths:
    {
      fleet: Fleet;
      path: any;
    }[] = [];

    for (let i = 0; i < this.selectedFleets.length; i++)
    {
      const fleet = this.selectedFleets[i];

      if (fleet.location.id === this.currentTarget.id) { continue; }

      const path = fleet.getPathTo(this.currentTarget);

      paths.push(
      {
        fleet: fleet,
        path: path,
      });
    }

    return paths;
  }

  getAllCurrentCurves()
  {
    const paths = this.getAllCurrentPaths();

    const curves:
    {
      style: string;
      segments: CurveSegment[];
    }[] = [];

    const totalPathsPerStar:
    {
      [starId: number]: number;
    } = {};
    const alreadyVisitedPathsPerStar:
    {
      [starId: number]: number;
    } = {};

    // get total paths passing through star
    // used for seperating overlapping paths to pass through
    // orbits around the star
    for (let i = 0; i < paths.length; i++)
    {
      for (let j = 0; j < paths[i].path.length; j++)
      {
        const star = paths[i].path[j].star;

        if (!totalPathsPerStar[star.id])
        {
          totalPathsPerStar[star.id] = 0;
          alreadyVisitedPathsPerStar[star.id] = 0;
        }

        totalPathsPerStar[star.id]++;
      }
    }

    for (let i = 0; i < paths.length; i++)
    {
      const fleet = paths[i].fleet;
      const path = paths[i].path;
      const distance = path.length - 1;

      const currentMovePoints = fleet.getMinCurrentMovePoints();
      const canReach = currentMovePoints >= distance;

      const style = canReach ? "reachable" : "unreachable";

      const curvePoints: Point[] = [];

      for (let j = path.length - 1; j >= 0; j--)
      {
        const star = path[j].star;

        const sourceStar = j < path.length - 1 ? path[j + 1].star : null;

        if (totalPathsPerStar[star.id] > 1 && star !== this.currentTarget)
        {
          const visits = ++alreadyVisitedPathsPerStar[star.id];
          curvePoints.unshift(this.getTargetOffset(star, sourceStar, visits,
            totalPathsPerStar[star.id], 12));
        }
        else
        {
          curvePoints.unshift(star);
        }
      }

      const segments = this.getSplineThroughPoints(curvePoints);

      curves.push(
      {
        style: style,
        segments: segments
      });
    }

    return curves;
  }

  drawAllCurrentCurves()
  {
    this.clearArrows();

    const curves = this.getAllCurrentCurves();

    for (let i = 0; i < curves.length; i++)
    {
      const curve = this.drawCurve(curves[i].segments, this.curveStyles[curves[i].style]);

      this.container.addChild(curve);
    }
  }

  getSplineThroughPoints(points: Point[]): CurveSegment[]
  {
    const i6 = 1.0 / 6.0;
    const segments: CurveSegment[] = [];
    // duplicate terminal points so that curve extends to them
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const path = [startPoint, ...points, endPoint];

    for (let i = 3; i < path.length; i++)
    {
      const p0 = path[i - 3];
      const p1 = path[i - 2];
      const p2 = path[i - 1];
      const p3 = path[i];

      segments.push(
      [
        p2.x * i6 + p1.x - p0.x * i6,
        p2.y * i6 + p1.y - p0.y * i6,
        p3.x * -i6 + p2.x + p1.x * i6,
        p3.y * -i6 + p2.y + p1.y * i6,
        p2.x,
        p2.y,
      ]);
    }

    // snap curve starting point to original starting point
    segments[0][0] = points[0].x;
    segments[0][1] = points[0].y;

    return segments;
  }

  private drawCurve(segments: CurveSegment[], style: PathfindingArrowCurveStyle)
  {
    const gfx = new PIXI.Graphics();

    gfx.lineStyle(12, style.color.getHex(), 0.7);
    gfx.moveTo(segments[0][0], segments[0][1]);

    for (let i = 0; i < segments.length; i++)
    {
      gfx.bezierCurveTo.apply(gfx, segments[i]);
    }

    // TODO 2019.07.01 | still relevant?
    // PIXI 3.0.7 bug
    // const curveShape = <PIXI.Polygon> gfx.currentPath.shape;
    // curveShape.closed = false;

    this.drawArrowHead(gfx, style.color.getHex());

    return gfx;
  }
  drawArrowHead(gfx: PIXI.Graphics, color: number)
  {
    // TODO 2019.07.02 | does this work in pixi5?
    // const curveShape = <PIXI.Polygon> gfx.currentPath.shape;
    // const points = curveShape.points;
    const points = gfx.currentPath.points;

    const x1 = points[points.length - 12];
    const y1 = points[points.length - 11];
    const x2 = points[points.length - 2];
    const y2 = points[points.length - 1];

    const lineAngle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 30;
    const buttAngle = 27 * (Math.PI / 180);

    const hypotenuseLength = Math.abs(headLength / Math.cos(buttAngle));

    const angle1 = lineAngle + Math.PI + buttAngle;
    const topX = x2 + Math.cos(angle1) * hypotenuseLength;
    const topY = y2 + Math.sin(angle1) * hypotenuseLength;

    const angle2 = lineAngle + Math.PI - buttAngle;
    const botX = x2 + Math.cos(angle2) * hypotenuseLength;
    const botY = y2 + Math.sin(angle2) * hypotenuseLength;

    gfx.lineStyle(null);

    gfx.moveTo(x2, y2);
    gfx.beginFill(color, 0.7);
    gfx.lineTo(topX, topY);
    gfx.lineTo(botX, botY);
    gfx.lineTo(x2, y2);
    gfx.endFill();

    const buttMidX = x2 + Math.cos(lineAngle + Math.PI) * headLength;
    const buttMidY = y2 + Math.sin(lineAngle + Math.PI) * headLength;

    for (let i = points.length - 1; i >= 0; i -= 2)
    {
      const y = points[i];
      const x = points[i - 1];
      const distance = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));

      if (distance >= headLength + 10)
      {
        points.push(buttMidX);
        points.push(buttMidY);
        break;
      }
      else
      {
        points.pop();
        points.pop();
      }
    }
  }

  getTargetOffset(
    target: Point,
    sourcePoint: Point,
    i: number,
    totalPaths: number,
    offsetPerOrbit: number,
  )
  {
    const maxPerOrbit = 6;

    const currentOrbit = Math.ceil(i / maxPerOrbit);
    const isOuterOrbit = currentOrbit > Math.floor(totalPaths / maxPerOrbit);
    const pathsInCurrentOrbit = isOuterOrbit ? totalPaths % maxPerOrbit : maxPerOrbit;

    const positionInOrbit = (i - 1) % pathsInCurrentOrbit;

    const distance = currentOrbit * offsetPerOrbit;

    let angle = (Math.PI * 2 / pathsInCurrentOrbit) * positionInOrbit;

    if (sourcePoint)
    {
      const dx = sourcePoint.x - target.x;
      const dy = sourcePoint.y - target.y;
      const approachAngle = Math.atan2(dy, dx);

      angle += approachAngle;
    }

    const x = Math.sin(angle) * distance;
    const y = Math.cos(angle) * distance;


    return(
    {
      x: target.x + x,
      y: target.y - y,
    });
  }
}
