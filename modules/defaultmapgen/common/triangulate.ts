import Point from "../../../src/Point";
import
{
  pointsEqual,
} from "../../../src/utility";

import Triangle from "./Triangle";


export default function triangulate<T extends Point>(vertices: T[]): Triangle<T>[]
{
  const triangles: Triangle<Point>[] = [];

  const superTriangle = makeSuperTriangle(vertices);
  triangles.push(superTriangle);

  for (let i = 0; i < vertices.length; i++)
  {
    const vertex = vertices[i];
    const edgeBuffer: Point[][] = [];

    for (let j = 0; j < triangles.length; j++)
    {
      const triangle = triangles[j];

      if (triangle.circumCircleContainsPoint(vertex))
      {
        const edges = triangle.getEdges();
        edgeBuffer.push(...edges);
        triangles.splice(j, 1);
        j--;
      }
    }

    if (i >= vertices.length)
    {
      continue;
    }

    for (let j = edgeBuffer.length - 2; j >= 0; j--)
    {
      for (let k = edgeBuffer.length - 1; k >= j + 1; k--)
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
    for (let j = 0; j < edgeBuffer.length; j++)
    {
      const newTriangle = new Triangle(
        edgeBuffer[j][0],
        edgeBuffer[j][1],
        vertex,
      );

      triangles.push(newTriangle);
    }
  }

  for (let i = triangles.length - 1; i >= 0; i--)
  {
    if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
    {
      triangles.splice(i, 1);
    }
  }
  const trianglesWithoutSuperTriangle = <Triangle<T>[]> triangles.filter(triangle =>
  {
    const verticesSharedWithSuperTriangle = triangle.getAmountOfSharedVerticesWith(superTriangle);

    return verticesSharedWithSuperTriangle === 0;
  });

  return trianglesWithoutSuperTriangle;
}

function makeSuperTriangle<T extends Point>(vertices: T[], highestCoordinateValue?: number): Triangle<Point>
{
  let max: number;

  if (highestCoordinateValue)
  {
    max = highestCoordinateValue;
  }
  else
  {
    max = vertices[0].x;

    for (let i = 0; i < vertices.length; i++)
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

  const triangle = new Triangle(
    {
      x: 3 * max,
      y: 0,
    },
    {
      x: 0,
      y: 3 * max,
    },
    {
      x: -3 * max,
      y: -3 * max,
    },
  );

  return triangle;
}

function edgesEqual<T extends Point>(e1: T[], e2: T[])
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
