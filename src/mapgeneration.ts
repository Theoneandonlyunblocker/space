/// <reference path="..//lib/pixi.d.ts" />

module Rance
{
  export class Triangle
  {
    edges: number[][][];

    circumCenterX: number;
    circumCenterY: number;
    circumRadius: number;

    constructor(
      public a: number[],
      public b: number[],
      public c: number[]
    )
    {
      
    }

    getPoints()
    {
      return [this.a, this.b, this.c];
    }
    calculateCircumCircle(tolerance: number = 0.00001)
    {
      var pA = this.a;
      var pB = this.b;
      var pC = this.c;

      var m1, m2;
      var mx1, mx2;
      var my1, my2;
      var cX, cY;

      if (Math.abs(pB[1] - pA[1]) < tolerance)
      {
        m2 = -(pC[0] - pB[0]) / (pC[1] - pB[1]);
        mx2 = (pB[0] + pC[0]) * 0.5;
        my2 = (pB[1] + pC[1]) * 0.5;

        cX = (pB[0] + pA[0]) * 0.5;
        cY = m2 * (cX - mx2) + my2;
      }
      else
      {
        m1 = -(pB[0] - pA[0]) / (pB[1] - pA[1]);
        mx1 = (pA[0] + pB[0]) * 0.5;
        my1 = (pA[1] + pB[1]) * 0.5;

        if (Math.abs(pC[1] - pB[1]) < tolerance)
        {
          cX = (pC[0] + pB[0]) * 0.5;
          cY = m1 * (cX - mx1) + my1;
        }
        else
        {
          m2 = -(pC[0] - pB[0]) / (pC[1] - pB[1]);
          mx2 = (pB[0] + pC[0]) * 0.5;
          my2 = (pB[1] + pC[1]) * 0.5;

          cX = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
          cY = m1 * (cX - mx1) + my1;
        }
      }

      this.circumCenterX = cX;
      this.circumCenterY = cY;



      mx1 = pB[0] - cX;
      my1 = pB[1] - cY;
      this.circumRadius = Math.sqrt(mx1 * mx1 + my1 * my1);
    }
    circumCircleContainsPoint(point: number[])
    {
      this.calculateCircumCircle();
      var x = point[0] - this.circumCenterX;
      var y = point[1] - this.circumCenterY;

      var contains = x * x + y * y <= this.circumRadius * this.circumRadius;

      return(contains);
    }
    getEdges()
    {
      if (!this.edges)
      {
        this.edges =
        [
          [this.a, this.b],
          [this.b, this.c],
          [this.c, this.a]
        ];
      }

      return this.edges;
    }
    sharesVertexesWith(toCheckAgainst: Triangle)
    {
      var ownPoints = this.getPoints();
      var otherPoints = toCheckAgainst.getPoints();

      for (var i = 0; i < ownPoints.length; i++)
      {
        if (otherPoints.indexOf(ownPoints[i]) >= 0)
        {
          return true;
        }
      }

      return false;
    }
  }
  export function triangulate(vertices: number[][])
  {
    var triangles: Triangle[] = [];

    var superTriangle = makeSuperTriangle(vertices);
    triangles.push(superTriangle);

    for (var i = 0; i < vertices.length; i++)
    {
      var vertex = vertices[i];
      var edgeBuffer = [];

      for (var j = 0; j < triangles.length; j++)
      {
        var triangle = triangles[j];

        if (triangle.circumCircleContainsPoint(vertex))
        {
          var edges = triangle.getEdges();
          edgeBuffer = edgeBuffer.concat(edges);
          triangles.splice(j, 1);
          j--;
        }
      }
      if (i >= vertices.length) continue;

      for (var j = edgeBuffer.length - 2; j >= 0; j--)
      {
        for (var k = edgeBuffer.length - 1; k >= j + 1; k--)
        {
          if (edgesEqual(edgeBuffer[k], edgeBuffer[j]))
          {
            console.log(edgeBuffer[j][0], edgeBuffer[j][1]);
            edgeBuffer.splice(k, 1);
            edgeBuffer.splice(j, 1);
            k--;
            continue;
          }
        }
      }
      for (var j = 0; j < edgeBuffer.length; j++)
      {
        var newTriangle = new Triangle(
          edgeBuffer[j][0],
          edgeBuffer[j][1],
          vertex
        )

        triangles.push(newTriangle);
      }
    }

    for (var i = triangles.length - 1; i >= 0; i--)
    {
      if (triangles[i].sharesVertexesWith(superTriangle))
      {
        triangles.splice(i, 1);
      }
    }

    return triangles;
  }

  export function makeSuperTriangle(vertices: number[][], highestCoordinateValue?: number)
  {
    var max;

    if (highestCoordinateValue)
    {
      max = highestCoordinateValue;
    }
    else
    {
      max = vertices[0][0];

      for (var i = 0; i < vertices.length; i++)
      {
        if (vertices[i][0] > max)
        {
          max = vertices[i][0];
        }
        if (vertices[i][1] > max)
        {
          max = vertices[i][1];
        }
      }
    }

    var triangle = new Triangle(
      [10 * max, 0],
      [0, 10 * max],
      [-10 * max, -10 * max]
    );

    return(triangle);
  }

  export function edgesEqual(e1: number[], e2: number[])
  {
    return(
      ((e1[0] == e2[1]) && (e1[1] == e2[0])) ||
      ((e1[0] == e2[0]) && (e1[1] == e2[1]))
    );
  }

  export function makeRandomPoints(count: number)
  {
    var points: number[][] = [];

    for (var i = 0; i < count; i++)
    {
      points.push(
      [
        Math.random() * 800,
        Math.random() * 600
      ]);
    }

    return points;
  }

  function arrayToPoints(points)
  {
    var _points = [];
    for (var i = 0; i < points.length; i++)
    {
      _points.push( new PIXI.Point(points[i][0], points[i][1]) );
    }
    return _points;
  }

  export var points = [];

  export function drawTriangles(triangles: Triangle[])
  {
    var container = document.createElement("div");
    document.body.appendChild(container);

    var stage = new PIXI.Stage(0xFFFFCC);

    var renderer = PIXI.autoDetectRenderer(
      800,
      600,
      null,
      false,
      true
    );

    container.appendChild(renderer.view);

    renderer.render(stage);

    stage.mousedown = function(e)
    {
      Rance.points.push([e.global.x, e.global.y]);

      var triangles = triangulate(Rance.points);

      stage.removeChildren();

      for (var i = 0; i < triangles.length; i++)
      {
        var gfx = new PIXI.Graphics();
        gfx.lineStyle(2, 0xFF0000, 1);

        var vertices = triangles[i].getPoints();
        var points = arrayToPoints(vertices);
        points.push(points[0].clone());

        gfx.drawPolygon(points);

        for (var j = 0; j < vertices.length; j++)
        {
          gfx.beginFill(0x000000);
          gfx.drawEllipse(vertices[j][0], vertices[j][1], 3, 3);
          gfx.endFill();
        }

        stage.addChild(gfx);
      }

      renderer.render(stage);

    }

  }
}
