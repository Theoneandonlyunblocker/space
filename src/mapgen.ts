/// <reference path="../lib/voronoi.d.ts" />
/// <reference path="../lib/pixi.d.ts" />

/// <reference path="../data/templates/mapgentemplates.ts" />

/// <reference path="triangulation.ts" />
/// <reference path="triangle.ts" />
/// <reference path="star.ts" />
/// <reference path="utility.ts" />

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    points: Star[] = [];
    regions:
    {
      [id: string]:
      {
        id: string;
        points: Star[];
      };
    } = {};
    triangles: Triangle[] = [];
    voronoiDiagram: any;

    galaxyConstructors:
    {
      [type: string]: (any) => Star[];
    } = {};

    drawnMap: PIXI.DisplayObjectContainer;

    constructor()
    {
      this.galaxyConstructors =
      {
        spiral: this.makeSpiralPoints
      }
    }
    reset()
    {
      this.points = [];
      this.regions = {};
      this.triangles = [];
      this.voronoiDiagram = null;
    }
    makeMap(options:
    {
      mapOptions:
      {
        width: number;
        height?: number;
      };
      starGeneration:
      {
        galaxyType: string;
        totalAmount: number;
        arms: number;
        centerSize: number;
        amountInCenter: number;
      };
      relaxation:
      {
        timesToRelax: number;
        dampeningFactor: number;
      };
    })
    {
      this.reset();

      this.maxWidth = options.mapOptions.width;
      this.maxHeight = options.mapOptions.height || this.maxWidth;

      this.points = this.generatePoints(options.starGeneration);

      this.makeVoronoi();
      this.relaxPoints(options.relaxation);

      this.triangulate();
      this.severArmLinks();

      return this;
    }

    generatePoints(options:
    {
      galaxyType: string;
      totalAmount: number;
      arms: number;
      centerSize: number;
      amountInCenter: number;
    })
    {
      var amountInArms = 1 - options.amountInCenter;

      var starGenerationProps =
      {
        amountPerArm: options.totalAmount / options.arms * amountInArms,
        arms: options.arms,
        amountInCenter: options.totalAmount * options.amountInCenter,
        centerSize: options.centerSize
      }

      var galaxyConstructor =
        this.galaxyConstructors[options.galaxyType];

      return galaxyConstructor.call(this, starGenerationProps);
    }
    makeRegion(name: string)
    {
      this.regions[name] =
      {
        id: name,
        points: []
      }
    }
    makeSpiralPoints(props:
    {
      amountPerArm: number;
      arms: number;
      amountInCenter: number;
      centerSize?: number;
      armOffsetMax?: number;
    })
    {
      var totalArms = props.arms * 2;
      var amountPerArm = props.amountPerArm;
      var amountPerFillerArm = amountPerArm / 2;

      var amountInCenter = props.amountInCenter;
      var centerThreshhold = props.centerSize || 0.35;

      var points = [];
      var armDistance = Math.PI * 2 / totalArms;
      var armOffsetMax = props.armOffsetMax || 0.5;
      var armRotationFactor = props.arms / 3;
      var galaxyRotation = randRange(0, Math.PI * 2);
      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;


      var makePoint = function makePointFN(distanceMin, distanceMax, region, armOffsetMax)
      {
        var distance = randRange(distanceMin, distanceMax);
        var offset = Math.random() * armOffsetMax - armOffsetMax / 2;
        offset *= (1 / distance);

        if (offset < 0) offset = Math.pow(offset, 2) * -1;
        else offset = Math.pow(offset, 2);

        var armRotation = distance * armRotationFactor;
        var angle = arm * armDistance + galaxyRotation + offset + armRotation;

        var x = Math.cos(angle) * distance * this.maxWidth + this.maxWidth;
        var y = Math.sin(angle) * distance * this.maxHeight + this.maxHeight;

        var point = new Star(x, y);

        point.distance = distance;
        point.region = region;

        return point;
      }.bind(this);

      this.makeRegion("center");
      

      var currentArmIsFiller = false;
      for (var i = 0; i < totalArms; i++)
      {
        var arm = i;
        var region = (currentArmIsFiller ? "filler_" : "arm_") + arm;
        var amountForThisArm = currentArmIsFiller ? amountPerFillerArm : amountPerArm;
        var maxOffsetForThisArm = currentArmIsFiller ? armOffsetMax / 2 : armOffsetMax;
        this.makeRegion(region);

        var amountForThisCenter = amountInCenter / totalArms;

        for (var j = 0; j < amountForThisArm; j++)
        {
          var point = makePoint(centerThreshhold, 1, region, maxOffsetForThisArm);

          points.push(point);
          this.regions[region].points.push(point);
        }

        for (var j = 0; j < amountForThisCenter; j++)
        {
          var point = makePoint(0, centerThreshhold, "center", armOffsetMax);
          points.push(point);
          this.regions["center"].points.push(point);
        }

        currentArmIsFiller = !currentArmIsFiller;
      }

      return points;
    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      var triangulationData = triangulate(this.points);
      this.triangles = this.cleanTriangles(triangulationData.triangles,
        triangulationData.superTriangle);

      this.makeLinks();
    }
    clearLinks()
    {
      for (var i = 0; i < this.points.length; i++)
      {
        this.points[i].clearLinks();
      }
    }
    makeLinks()
    {
      if (!this.triangles || this.triangles.length < 1) throw new Error();

      this.clearLinks();

      for (var i = 0; i < this.triangles.length; i++)
      {
        var edges = <Star[][]> this.triangles[i].getEdges();
        for (var j = 0; j < edges.length; j++)
        {
          edges[j][0].addLink(edges[j][1]);
        }
      }
    }
    severArmLinks()
    {
      for (var i = 0; i < this.points.length; i++)
      {
        var star = this.points[i];
        star.severLinksToFiller();
        star.severLinksToNonAdjacent();

        if (star.distance > 0.8)
        {
          star.severLinksToNonCenter();
        }
      }
    }
    makeVoronoi()
    {
      if (!this.points || this.points.length < 3) throw new Error();

      var boundingBox =
      {
        xl: 0,
        xr: this.maxWidth * 2,
        yt: 0,
        yb: this.maxHeight * 2
      };

      var voronoi = new Voronoi();

      var diagram = voronoi.compute(this.points, boundingBox);

      this.voronoiDiagram = diagram;

      for (var i = 0; i < diagram.cells.length; i++)
      {
        diagram.cells[i].site.voronoiCell = diagram.cells[i];
      }
    }
    cleanTriangles(triangles: Triangle[], superTriangle: Triangle)
    {
      for (var i = triangles.length - 1; i >= 0; i--)
      {
        if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
        {
          triangles.splice(i, 1);
        }
      }

      return triangles;
    }
    getVerticesFromCell(cell: any)
    {
      var vertices = [];

      for (var i = 0; i < cell.halfedges.length; i++)
      {
        vertices.push(cell.halfedges[i].getStartpoint());
      }

      return vertices;
    }
    relaxPointsOnce(dampeningFactor: number = 0)
    {
      var relaxedPoints = [];

      for (var i = 0; i < this.voronoiDiagram.cells.length; i++)
      {
        var cell = this.voronoiDiagram.cells[i];
        var point = cell.site;
        var vertices = this.getVerticesFromCell(cell);
        var centroid = getCentroid(vertices);
        var timesToDampen = point.distance * dampeningFactor;

        for (var j = 0; j < timesToDampen; j++)
        {
          centroid.x = (centroid.x + point.x) / 2;
          centroid.y = (centroid.y + point.y) / 2;
        }

        point.setPosition(centroid.x, centroid.y);
      }
    }
    relaxPoints(options:
      {
        timesToRelax: number;
        dampeningFactor: number;
      })
    {
      if (!this.points) throw new Error();

      if (!this.voronoiDiagram) this.makeVoronoi();

      for (var i = 0; i < options.timesToRelax; i++)
      {
        this.relaxPointsOnce(options.dampeningFactor);
        this.makeVoronoi();
      }
    }
    drawMap()
    {
      function vectorToPoint(vector)
      {
        return new PIXI.Point(vector[0], vector[1])
      }

      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;


      var doc = new PIXI.DisplayObjectContainer();

      if (this.voronoiDiagram)
      {
        for (var i = 0; i < this.voronoiDiagram.cells.length; i++)
        {
          var cell = this.voronoiDiagram.cells[i];
          var cellVertices = this.getVerticesFromCell(cell);

          var poly = new PIXI.Polygon(cellVertices);
          var polyGfx: any = new PIXI.Graphics();
          polyGfx.interactive = true;
          polyGfx.lineStyle(6, 0xFF0000, 1);

          polyGfx.beginFill(0x0000FF, 0.3);
          polyGfx.drawShape(poly);
          polyGfx.endFill();

          polyGfx.cell = cell;

          polyGfx.rightclick = function()
          {
            console.log(this.cell.site.x, this.cell.site.y);
            console.log(this.worldTransform);
          }
          polyGfx.mouseover = function()
          {
            this.position.y -= 10
          }
          polyGfx.mouseout = function()
          {
            this.position.y += 10
          }

          doc.addChild(polyGfx);
        }


      }

      var gfx = new PIXI.Graphics();
      gfx.lineStyle(3, 0x000000, 1);

      doc.addChild(gfx);

      
      for (var i = 0; i < this.points.length; i++)
      {
        var star = this.points[i];
        var links = star.linksTo;

        for (var j = 0; j < links.length; j++)
        {
          gfx.moveTo(star.x, star.y);
          gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
        }

      }
      
      // for (var i = 0; i < this.points.length; i++)
      // {
      //   var star = this.points[i];

      //   for (var j = 0; j < star.linksFrom.length; j++)
      //   {
      //     gfx.moveTo(star.x, star.y);
      //     gfx.lineTo(star.linksFrom[j].x, star.linksFrom[j].y);
      //   }
      // }

      // for (var i = 0; i < this.triangles.length; i++)
      // {
      //   var triangle = this.triangles[i];
      //   var edges = triangle.getEdges();

      //   for (var j = 0; j < edges.length; j++)
      //   {

      //     gfx.moveTo(edges[j][0].x, edges[j][0].y);
      //     gfx.lineTo(edges[j][1].x, edges[j][1].y);
      //   }
      // }

      for (var i = 0; i < this.points.length; i++)
      {
        var fillColor = 0xFF0000;
        if (this.points[i].region == "center")
        {
          fillColor = 0x00FF00;
        }
        else if (this.points[i].region.indexOf("filler") >= 0)
        {
          fillColor = 0x0000FF;
        };

        gfx.beginFill(fillColor);
        gfx.drawEllipse(this.points[i].x, this.points[i].y, 6, 6);
        gfx.endFill();
      }

      doc.height;
      this.drawnMap = doc;
      return doc;
    }
  }
}
