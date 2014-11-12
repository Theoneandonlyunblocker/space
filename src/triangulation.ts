/// <reference path="triangle.ts" />

module Rance
{
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

  export function voronoiFromTriangles(triangles: Triangle[])
  {
    var trianglesPerPoint: any = {};
    for (var i = 0; i < triangles.length; i++)
    {
      var triangle = triangles[i];
      var points = triangle.getPoints();

      for (var j = 0; j < points.length; j++)
      {
        if (!trianglesPerPoint[points[j]])
        {
          trianglesPerPoint[points[j]] = [];
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

    var voronoiLinesPerPoint: any = {};

    for (var point in trianglesPerPoint)
    {
      var pointTriangles = trianglesPerPoint[point];

      var trianglePairs = makeTrianglePairs(pointTriangles);
      voronoiLinesPerPoint[point] = [];

      for (var i = 0; i < trianglePairs.length; i++)
      {
        voronoiLinesPerPoint[point].push(
          [
            trianglePairs[i][0].getCircumCenter(),
            trianglePairs[i][1].getCircumCenter()
          ]
        ); 
      }
    }

    return voronoiLinesPerPoint;
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
}