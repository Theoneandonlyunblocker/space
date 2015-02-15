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

    clearTargetTimeout: any;

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
      this.parentContainer.addChild(this.container);

      this.addEventListeners();
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

      this.addEventListener("mouseUp", function(e)
      {
        self.endMove();
      });
    }

    startMove()
    {
      var fleets = app.playerControl.selectedFleets; // TODO

      if (this.active || !fleets || fleets.length < 1)
      {
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

      if (this.clearTargetTimeout)
      {
        window.clearTimeout(this.clearTargetTimeout);
      }

      this.currentTarget = star;
      this.drawAllCurrentCurves();
    }

    clearTarget()
    {
      if (!this.active)
      {
        return;
      }

      var self = this;

      if (this.clearTargetTimeout)
      {
        window.clearTimeout(this.clearTargetTimeout);
      }

      this.clearTargetTimeout = window.setTimeout(function()
      {
        self.currentTarget = null;
        self.clearArrows();
        self.clearTargetTimeout = null;
      }, 10)
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

        if (fleet.location.id === this.currentTarget.id) continue;

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
      var self = this;

      var curves:
      {
        style: string;
        curveData: number[][];
      }[] = [];

      var totalPathsPerStar:
      {
        [starId: number]: number;
      } = {};
      var alreadyVisitedPathsPerStar:
      {
        [starId: number]: number;
      } = {};

      // get total paths passing through star
      // used for seperating overlapping paths to pass through
      // orbits around the star
      for (var i = 0; i < paths.length; i++)
      {
        for (var j = 0; j < paths[i].path.length; j++)
        {
          var star = paths[i].path[j].star;

          if (!totalPathsPerStar[star.id])
          {
            totalPathsPerStar[star.id] = 0;
            alreadyVisitedPathsPerStar[star.id] = 0;
          }

          totalPathsPerStar[star.id]++;
        }
      }

      for (var i = 0; i < paths.length; i++)
      {
        var fleet = paths[i].fleet;
        var path = paths[i].path;
        var distance = path.length - 1;

        var currentMovePoints = fleet.getMinCurrentMovePoints();
        var canReach = currentMovePoints >= distance;

        var style = canReach ? "reachable" : "unreachable";

        var stars = path.map(function(pathPoint)
        {
          var star = pathPoint.star;
          if (totalPathsPerStar[star.id] > 1)
          {
            var visits = ++alreadyVisitedPathsPerStar[star.id];
            return self.getTargetOffset(star, visits, totalPathsPerStar[star.id], 12);
          }
          else
          {
            return star;
          }
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


      gfx.lineStyle(4, style.color, 0.7);
      gfx.moveTo(points[0][0], points[0][1]);

      for (var i = 0; i < points.length; i++)
      {
        gfx.bezierCurveTo.apply(gfx, points[i]);
      }
      gfx.height;

      return gfx;
    }

    getTargetOffset(target: Point, i: number, totalPaths: number, offsetPerOrbit: number)
    {
      var maxPerOrbit = 6;

      var currentOrbit = Math.ceil(i / maxPerOrbit);
      var isOuterOrbit = currentOrbit > Math.floor(totalPaths / maxPerOrbit);
      var pathsInCurrentOrbit = isOuterOrbit ? totalPaths % maxPerOrbit : maxPerOrbit;

      var positionInOrbit = (i - 1) % pathsInCurrentOrbit;

      var distance = currentOrbit * offsetPerOrbit;

      var angle = (Math.PI * 2 / pathsInCurrentOrbit) * positionInOrbit;

      var x = Math.sin(angle) * distance;
      var y = Math.cos(angle) * distance;

      console.log(positionInOrbit, maxPerOrbit, (180 / Math.PI) * angle);
      
      return(
      {
        x: target.x + x,
        y: target.y - y
      });
    }
  }
}
