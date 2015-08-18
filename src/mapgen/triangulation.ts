/// <reference path="triangle.ts" />
/// <reference path="../point.ts" />

module Rance
{
  export module MapGen
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

      /*
      for (var i = triangles.length - 1; i >= 0; i--)
      {
        if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
        {
          triangles.splice(i, 1);
        }
      }*/
      return(
      {
        triangles: triangles,
        superTriangle: superTriangle
      });
    }

    export function voronoiFromTriangles(triangles: Triangle[])
    {
      var trianglesPerPoint: any = {};
      var voronoiData: any = {};

      for (var i = 0; i < triangles.length; i++)
      {
        var triangle = triangles[i];
        var points = triangle.getPoints();

        for (var j = 0; j < points.length; j++)
        {
          if (!trianglesPerPoint[points[j]])
          {
            trianglesPerPoint[points[j]] = [];
            voronoiData[points[j]] =
            {
              point: points[j]
            }
          }

          trianglesPerPoint[points[j]].push(triangle);
        }
      }
      function makeTrianglePairs(triangles: Triangle[])
      {
        var toMatch = triangles.slice(0);
        var pairs: Triangle[][] = [];

        for (var i = toMatch.length - 2; i >= 0; i--)
        {
          for (var j = toMatch.length - 1; j >= i + 1; j--)
          {
            var matchingVertices = toMatch[i].getAmountOfSharedVerticesWith(toMatch[j]);

            if (matchingVertices === 2)
            {
              pairs.push([toMatch[j], toMatch[i]]);
            }
          }
        }

        return pairs;
      }

      for (var point in trianglesPerPoint)
      {
        var pointTriangles = trianglesPerPoint[point];

        var trianglePairs = makeTrianglePairs(pointTriangles);
        voronoiData[point].lines = [];

        for (var i = 0; i < trianglePairs.length; i++)
        {
          voronoiData[point].lines.push(
            [
              trianglePairs[i][0].getCircumCenter(),
              trianglePairs[i][1].getCircumCenter()
            ]
          ); 
        }
      }

      return voronoiData;
    }

    export function getCentroid(vertices: Point[]): Point
    {
      var signedArea = 0;
      var x = 0;
      var y = 0;
      var x0; // Current vertex X
      var y0; // Current vertex Y
      var x1; // Next vertex X
      var y1; // Next vertex Y
      var a;  // Partial signed area

      var i = 0;

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

    export function makeSuperTriangle(vertices: Point[], highestCoordinateValue?: number)
    {
      var max;

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

    export function edgesEqual(e1: Point[], e2: Point[])
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