/// <reference path="triangulation.ts" />

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    pointsToGenerate: number;
    points: number[][];
    triangles: Triangle[];
    voronoi: any;

    constructor()
    {
      this.maxWidth = 800;
      this.maxHeight = 400;
    }

    generatePoints(amount: number = this.pointsToGenerate)
    {
      this.pointsToGenerate = amount;

      if (!amount) throw new Error();

      this.points = this.makePolarPoints(amount);
    }
    makeRandomPoints(amount: number)
    {
      var points: number[][] = [];

      for (var i = 0; i < amount; i++)
      {
        points.push(
        [
          Math.random() * this.maxWidth,
          Math.random() * this.maxHeight
        ]);
      }

      return points;
    }
    makePolarPoints(amount: number)
    {
      var points = [];
      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;

      for (var i = 0; i < amount; i++)
      {
        var distance = Math.random() * minBound;

        var angle = Math.random() * 2 * Math.PI;

        var x = Math.cos(angle) * distance + minBound2;
        var y = Math.sin(angle) * distance + minBound2;

        points.push([x, y]);
      }

      return points;
    }
    makeMap(amountOfPoints: number, timesToRelax: number)
    {
      if (!this.points)
      {
        this.generatePoints(amountOfPoints);
      }

      this.triangulate();

      for (var i = 0; i < timesToRelax; i++)
      {
        this.relaxVoronoi();
      }
    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      var triangulationData = triangulate(this.points);
      this.triangles = this.cleanTriangles(triangulationData.triangles,
        triangulationData.superTriangle);
      this.voronoi = voronoiFromTriangles(this.triangles);

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
    relaxVoronoi()
    {
      var relaxedPoints = [];
      for (var point in this.voronoi)
      {
        var edges = this.voronoi[point].edges;
        var verticesIndex: any = {};
        var vertices = [];

        for (var i = 0; i < edges.length; i++)
        {
          verticesIndex[edges[i][0]] = edges[i][0];
          verticesIndex[edges[i][1]] = edges[i][1];
        }
        for (var _vertex in verticesIndex)
        {
          vertices.push(verticesIndex[_vertex]);
        }

        if (vertices.length < 3)
        {
          relaxedPoints.push()
        }

        var centroid = getCentroid(vertices);

        if (!isFinite(centroid[0])) debugger;

        relaxedPoints.push(centroid);
      }

      debugger;

      this.points = relaxedPoints;
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
      //var mask = new PIXI.Graphics();
      //doc.addChild(mask);
      //mask.beginFill();
      //mask.drawRect(-minBound2, -minBound2, minBound * 2, minBound * 2);
      //mask.endFill();
      //doc.mask = mask;

      var gfx = new PIXI.Graphics();
      gfx.lineStyle(2, 0x000000, 1);

      doc.addChild(gfx);

      for (var i = 0; i < this.triangles.length; i++)
      {
        var triangle = this.triangles[i];
        var vertices = triangle.getPoints();

        for (var j = 0; j < vertices.length; j++)
        {
          var current = vertices[j];
          var next = vertices[(j + 1) % vertices.length];

          gfx.moveTo(current[0], current[1]);
          gfx.lineTo(next[0], next[1]);
        }
      }
      for (var i = 0; i < this.points.length; i++)
      {
        gfx.beginFill(0xFFFFFF);
        gfx.drawEllipse(this.points[i][0], this.points[i][1], 6, 6);
        gfx.endFill();
      }

      gfx.lineStyle(1, 0xFF0000, 1);

      for (var point in this.voronoi)
      {
        var lines = this.voronoi[point];

        for (var i = 0; i < lines.length; i++)
        {
          var line = lines[i];

          gfx.moveTo(line[0][0], line[0][1]);
          gfx.lineTo(line[1][0], line[1][1]);
        }
        
      }


      return doc;
    }
  }
}
