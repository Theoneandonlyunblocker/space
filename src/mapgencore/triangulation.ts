/// <reference path="triangle.ts" />
/// <reference path="../point.ts" />

module Rance
{
  export module MapGenCore
  {
    export function triangulate(vertices: Point[])
    {
      var triangles: Triangle[] = [];

      var superTriangle = makeSuperTriangle(vertices);
      triangles.push(superTriangle);

      for (var i = 0; i < vertices.length; i++)
      {
        var vertex: Point = vertices[i];
        var edgeBuffer: Point[][] = [];

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
        if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
        {
          triangles.splice(i, 1);
        }
      }

      return triangles;
    }

    export function getCentroid(vertices: Point[]): Point
    {
      var signedArea: number = 0;
      var x: number = 0;
      var y: number = 0;
      var x0: number; // Current vertex X
      var y0: number; // Current vertex Y
      var x1: number; // Next vertex X
      var y1: number; // Next vertex Y
      var a: number;  // Partial signed area

      var i: number = 0;

      for (i = 0; i < vertices.length - 1; i++)
      {
        x0 = vertices[i].x;
        y0 = vertices[i].y;
        x1 = vertices[i+1].x;
        y1 = vertices[i+1].y;
        a = x0*y1 - x1*y0;
        signedArea += a;
        x += (x0 + x1)*a;
        y += (y0 + y1)*a;
      }

      x0 = vertices[i].x;
      y0 = vertices[i].y;
      x1 = vertices[0].x;
      y1 = vertices[0].y;
      a = x0*y1 - x1*y0;
      signedArea += a;
      x += (x0 + x1)*a;
      y += (y0 + y1)*a;

      signedArea *= 0.5;
      x /= (6.0*signedArea);
      y /= (6.0*signedArea);

      return(
      {
        x: x,
        y: y
      });
    }

    function makeSuperTriangle(vertices: Point[], highestCoordinateValue?: number)
    {
      var max: number;

      if (highestCoordinateValue)
      {
        max = highestCoordinateValue;
      }
      else
      {
        max = vertices[0].x;

        for (var i = 0; i < vertices.length; i++)
        {
          if (vertices[i].x > max)
          {
            max = vertices[i].x;
          }
          if (vertices[i].y > max)
          {
            max = vertices[i].y;
          }
        }
      }

      var triangle = new Triangle(
        {
          x: 3 * max,
          y: 0
        },
        {
          x: 0,
          y: 3 * max
        },
        {
          x: -3 * max,
          y: -3 * max
        }
      );

      return(triangle);
    }

    export function pointsEqual(p1: Point, p2: Point)
    {
      return (p1.x === p2.x && p1.y === p2.y);
    }

    function edgesEqual(e1: Point[], e2: Point[])
    {
      return(
        (
          pointsEqual(e1[0], e2[0]) && pointsEqual(e1[1], e2[1])
        ) ||
        (
          pointsEqual(e1[0], e2[1]) && pointsEqual(e1[1], e2[0])
        )
      );
    }
  }
}