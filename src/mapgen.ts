/// <reference path="triangulation.ts" />

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    pointsToGenerate: number;
    points: Point[];
    triangles: Triangle[];
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

      this.points = this.makePolarPoints(amount);
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

        var x = Math.cos(angle) * distance + minBound;
        var y = Math.sin(angle) * distance + minBound;

        points.push(
        {
          x: x,
          y: y
        });
      }

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
    /*
    relaxVoronoi()
    {
      var relaxedPoints = [];
      for (var _point in this.voronoi)
      {
        var edges = this.voronoi[_point].lines;
        var point = this.voronoi[_point].point;
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
          relaxedPoints.push(point);
        }
        else
        {
          var centroid = getCentroid(vertices);
  
          relaxedPoints.push(centroid);
        }

      }
      this.points = relaxedPoints;
      this.triangulate();
    }
    */
    drawMap()
    {
      function vectorToPoint(vector)
      {
        return new PIXI.Point(vector[0], vector[1])
      }

      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;


      var doc = new PIXI.DisplayObjectContainer();

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


      gfx.lineStyle(1, 0xFF0000, 1);
      for (var i = 0; i < this.voronoiDiagram.edges.length; i++)
      {
        var edge = this.voronoiDiagram.edges[i];
        gfx.moveTo(edge.va.x, edge.va.y);
        gfx.lineTo(edge.vb.x, edge.vb.y);
      }

      return doc;
    }
  }
}
