/// <reference path="triangulation.ts" />

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    pointsToGenerate: number;
    points: Point[] = [];
    arms:
    {
      [id: number]: Point[]
    } = {};
    triangles: Triangle[] = [];
    voronoiDiagram: any;

    constructor()
    {
      this.maxWidth = 800;
      this.maxHeight = 400;
    }

    generatePoints(amount: number = this.pointsToGenerate)
    {
      this.pointsToGenerate = amount;

      if (!amount) throw new Error();

      this.points = this.makeSpiralPoints(amount);
    }
    setupArms(numberOfArms: number)
    {
      for (var i = 0; i < numberOfArms; i++)
      {
        this.arms[i] = [];
      }
    }
    makeSpiralPoints(
      amount: number,
      numberOfArms: number = 5
    )
    {
      this.setupArms(numberOfArms);

      var points = [];
      var armDistance = Math.PI * 2 / numberOfArms;
      var armOffsetMax = 0.5;
      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;

      for (var i = 0; i < amount; i++)
      {
        var distance = Math.random();

        var angle = Math.random() * 2 * Math.PI;
        var armOffset = Math.random() * armOffsetMax;
        armOffset -= armOffsetMax / 2;
        armOffset *= (1 / distance);

        if (armOffset < 0) armOffset = Math.pow(armOffset, 2) * -1;
        else armOffset = Math.pow(armOffset, 2);

        var arm = Math.round(angle / armDistance) % numberOfArms;
        angle = arm * armDistance + armOffset;

        var x = Math.cos(angle) * distance * minBound + minBound;
        var y = Math.sin(angle) * distance * minBound + minBound;

        var point =
        {
          x: x,
          y: y,
          distance: distance,
          arm: arm
        };

        points.push(point);
        this.arms[arm].push(point);
      }
      console.log(this.arms)

      return points;

    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      var triangulationData = triangulate(this.points);
      this.triangles = this.cleanTriangles(triangulationData.triangles,
        triangulationData.superTriangle);
    }
    makeVoronoi()
    {
      if (!this.points || this.points.length < 3) throw new Error();

      var minBound = Math.min(this.maxWidth, this.maxHeight);

      var boundingBox =
      {
        xl: 0,
        xr: minBound * 2,
        yt: 0,
        yb: minBound * 2
      };

      var voronoi = new Voronoi();

      var diagram = voronoi.compute(this.points, boundingBox);

      this.voronoiDiagram = diagram;
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
    relaxPoints()
    {
      var relaxedPoints = [];

      for (var i = 0; i < this.voronoiDiagram.cells.length; i++)
      {
        var cell = this.voronoiDiagram.cells[i];
        var point = cell.site;
        var vertices = this.getVerticesFromCell(cell);
        var centroid = getCentroid(vertices);

        var adjusted = centroid;

        adjusted.arm = point.arm;
        adjusted.distance = point.distance;
        
        var timesToDampen = point.distance * 4;

        for (var j = 0; j < timesToDampen; j++)
        {
          adjusted.x = (adjusted.x + point.x) / 2;
          adjusted.y = (adjusted.y + point.y) / 2;
        }

        relaxedPoints.push(adjusted);
      }

      return relaxedPoints;
    }
    relaxAndRecalculate(times: number = 1)
    {
      if (!this.points) throw new Error();

      if (!this.voronoiDiagram) this.makeVoronoi();

      for (var i = 0; i < times; i++)
      {
        var relaxed = this.relaxPoints();
        this.points = relaxed;
        this.makeVoronoi();
      }

      this.triangulate();
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
          var polyGfx = new PIXI.Graphics();
          polyGfx.interactive = true;
          polyGfx.lineStyle(6, 0xFF0000, 1);

          polyGfx.beginFill(0x0000FF, 0.3);
          polyGfx.drawShape(poly);
          polyGfx.endFill();

          polyGfx.rightclick = function(cell)
          {
            console.log()
            console.log(cell.site.x);
          }.bind(null, cell);

          doc.addChild(polyGfx);
        }
      }

      var gfx = new PIXI.Graphics();
      gfx.lineStyle(3, 0x000000, 1);

      doc.addChild(gfx);

      for (var i = 0; i < this.triangles.length; i++)
      {
        var triangle = this.triangles[i];
        var vertices = triangle.getPoints();

        for (var j = 0; j < vertices.length; j++)
        {
          var current = vertices[j];
          var next = vertices[(j + 1) % vertices.length];

          gfx.moveTo(current.x, current.y);
          gfx.lineTo(next.x, next.y);
        }
      }
      for (var i = 0; i < this.points.length; i++)
      {
        gfx.beginFill(0xFFFFFF);
        gfx.drawEllipse(this.points[i].x, this.points[i].y, 6, 6);
        gfx.endFill();
      }

      
      return doc;
    }
  }
}
