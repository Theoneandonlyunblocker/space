import Triangle from "./Triangle.ts";
import Point from "../Point.ts";

import
{
  pointsEqual
} from "../utility.ts";

export function triangulate(vertices: Point[]): Triangle[]
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

function makeSuperTriangle(vertices: Point[], highestCoordinateValue?: number): Triangle
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

  return triangle;
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
