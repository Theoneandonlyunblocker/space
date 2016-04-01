/// <reference path="../../lib/voronoi.d.ts" />

/// <reference path="../point.ts" />
/// <reference path="triangulation.ts" />

export function makeVoronoi(points: Point[], width: number, height: number)
{
  var boundingBox =
  {
    xl: 0,
    xr: width,
    yt: 0,
    yb: height
  };

  var voronoi = new Voronoi();
  var diagram = voronoi.compute(points, boundingBox);

  for (var i = 0; i < diagram.cells.length; i++)
  {
    var cell = diagram.cells[i];
    cell.site.voronoiCell = cell;
    cell.vertices = getVerticesFromCell(cell);
  }

  return diagram;
}

/**
 * Perform one iteration of Lloyd's Algorithm to move points in voronoi diagram to their centroid
 * @param {any}             diagram Voronoi diagram to relax
 * @param {(any) => number} dampeningFunction If specified, use value returned by dampeningFunction(cell.site)
 *                                            to adjust how far towards centroid the point is moved.
 *                                            0.0 = not moved, 0.5 = moved halfway, 1.0 = moved fully
 */
export function relaxVoronoi(diagram: any, dampeningFunction?: (point: any) => number)
{
  for (var i = 0; i < diagram.cells.length; i++)
  {
    var cell = diagram.cells[i];
    var point = cell.site;
    var centroid = getCentroid(cell.vertices);
    if (dampeningFunction)
    {
      var dampeningValue = dampeningFunction(point);

      var xDelta = (centroid.x - point.x) * dampeningValue;
      var yDelta = (centroid.y - point.y) * dampeningValue;

      point.setPosition(point.x + xDelta, point.y + yDelta);
    }
    else
    {
      point.setPosition(centroid.x, centroid.y);
    }
  }
}

function getVerticesFromCell(cell: any)
{
  var vertices: Point[] = [];

  for (var i = 0; i < cell.halfedges.length; i++)
  {
    vertices.push(cell.halfedges[i].getStartpoint());
  }

  return vertices;
}
