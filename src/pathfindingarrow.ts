/// <reference path="../lib/pixi.d.ts" />

/// <reference path="eventmanager.ts"/>

/// <reference path="fleet.ts" />
/// <reference path="star.ts" />

module Rance
{
  export class PathfindingArrow
  {
    parentContainer: PIXI.DisplayObjectContainer;
    container: PIXI.DisplayObjectContainer;
    active: boolean;
    currentTarget: Star;

    selectedFleets: Fleet[];

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

    curveStyles =
    {
      reachable:
      {
        color: 0xFFFFF0
      },
      unreachable:
      {
        color: 0xFF0000
      }
    };

    constructor(parentContainer: PIXI.DisplayObjectContainer)
    {
      this.parentContainer = parentContainer;
      this.container = new PIXI.DisplayObjectContainer();
    }
    removeEventListener(name: string)
    {
      eventManager.removeEventListener(name, this.listeners[name]);
    }
    removeEventListeners()
    {
      for (var name in this.listeners)
      {
        this.removeEventListener(name);
      }
    }
    addEventListener(name: string, handler)
    {
      this.listeners[name] = handler;

      eventManager.addEventListener(name, handler);
    }
    addEventListeners()
    {
      var self = this;

      this.addEventListener("startPotentialMove", function(e)
      {
        self.startMove();
      });

      this.addEventListener("setPotentialMoveTarget", function(e)
      {
        self.setTarget(e.data);
      });
      this.addEventListener("clearPotentialMoveTarget", function(e)
      {
        self.clearTarget();
      });

      this.addEventListener("endPotentialMove", function(e)
      {
        self.endMove();
      });
    }

    startMove()
    {
      var fleets = app.playerControl.selectedFleets; // TODO

      if (this.active || !fleets || fleets.length < 1)
      {
        debugger;
        return;
      }

      this.active = true;
      this.currentTarget = null;
      this.selectedFleets = fleets
      this.clearArrows();
    }

    setTarget(star: Star)
    {
      if (!this.active)
      {
        return;
      }

      this.currentTarget = star;
    }

    clearTarget()
    {
      if (!this.active)
      {
        return;
      }

      this.currentTarget = null;
      this.clearArrows();
    }

    endMove()
    {
      this.active = false;
      this.currentTarget = null;
      this.selectedFleets = null;
      this.clearArrows();
    }

    clearArrows()
    {
      this.container.removeChildren();
    }

    makeLabel(style: string, distance: number)
    {
      var textStyle;

      switch (style)
      {
        case "reachable":
        {
          textStyle =
          {
            fill: 0xFFFFF0
          }
          break;
        }
        case "unreachable":
        {
          textStyle =
          {
            fill: 0xFF0000
          }
          break;
        }
      }

      if (!this.labelCache[style])
      {
        this.labelCache[style] = {};
      }

      this.labelCache[style][distance] = new PIXI.Text(distance, textStyle);
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
      var paths:
      {
        fleet: Fleet;
        path: any;
      }[] = [];

      for (var i = 0; i < this.selectedFleets.length; i++)
      {
        var fleet = this.selectedFleets[i];

        var path = fleet.getPathTo(this.currentTarget);

        paths.push(
        {
          fleet: fleet,
          path: path
        });
      }

      return paths;
    }

    getAllCurrentCurves()
    {
      var paths = this.getAllCurrentPaths();

      var curves:
      {
        style: string;
        curveData: number[][];
      }[] = [];

      for (var i = 0; i < paths.length; i++)
      {
        var fleet = paths[i].fleet;
        var path = paths[i].path;
        var distance = path.length - 1;

        var currentMovePoints = fleet.getMinCurrentMovePoints();
        var canReach = currentMovePoints >= distance;

        var style = canReach ? "reachable" : "unreachable";

        var stars = path.filter(function(pathPoint)
        {
          return pathPoint.star;
        });
        var curveData = this.getCurveData(stars);

        curves.push(
        {
          style: style,
          curveData: curveData
        });
      }

      return curves;
    }

    drawAllCurrentCurves()
    {
      this.clearArrows();
      var curves = this.getAllCurrentCurves();

      for (var i = 0; i < curves.length; i++)
      {
        var curve = this.drawCurve(curves[i].curveData, this.curveStyles[curves[i].style]);

        this.container.addChild(curve);
      }
    }

    getCurveData(points: Star[]): number[][]
    {
      var i6 = 1.0 / 6.0;
      var path = [];
      var abababa = [points[0]].concat(points);
      abababa.push(points[points.length - 1]);

      console.log(abababa);

      for (var i = 3, n = abababa.length; i < n; i++)
      {

        var p0 = abababa[i - 3];
        var p1 = abababa[i - 2];
        var p2 = abababa[i - 1];
        var p3 = abababa[i];

        path.push(
        [
          p2.x * i6 + p1.x - p0.x * i6,
          p2.y * i6 + p1.y - p0.y * i6,
          p3.x * -i6 + p2.x + p1.x * i6,
          p3.y * -i6 + p2.y + p1.y * i6,
          p2.x,
          p2.y
        ]);
      }

      return path;
    }

    drawCurve(points: number[][], style)
    {
      var gfx = new PIXI.Graphics();

      console.log(points);

      gfx.lineStyle(4, style.color, 0.8);
      gfx.moveTo(points[0][0], points[0][1]);

      for (var i = 0; i < points.length; i++)
      {
        gfx.bezierCurveTo.apply(gfx, points[i]);
      }
      gfx.height;

      return gfx;
    }

    
  }
}