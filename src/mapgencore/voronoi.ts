/// <reference path="../../lib/voronoi.d.ts" />

import Point from "../Point";
import FillerPoint from "../FillerPoint";
import Star from "../Star";
import VoronoiCell from "../VoronoiCell";

export function makeVoronoi<T extends Point>(points: T[], width: number, height: number)
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

  return diagram;
}
/**
 * Perform one iteration of Lloyd's Algorithm to move points in voronoi diagram to their centroid
 * @param {Voronoi.Result}             diagram Voronoi diagram to relax
 * @param {(Point) => number} getRelaxAmountFN If specified, use value returned by getRelaxAmountFN(cell.site)
 *                                            to adjust how far towards centroid the point is moved.
 *                                            0.0 = not moved, 0.5 = moved halfway, 1.0 = moved fully
 */
export function relaxVoronoi<T extends Point>(
  diagram: Voronoi.Result<T>,
  getRelaxAmountFN?: (point: T) => number
): void
{
  for (let i = 0; i < diagram.cells.length; i++)
  {
    var cell = diagram.cells[i];
    var point = cell.site;
    
    const vertices = cell.halfedges.map(halfEdge =>
    {
      return halfEdge.getStartpoint();
    });
    
    const centroid = getPolygonCentroid(vertices);
    if (getRelaxAmountFN)
    {
      var dampeningValue = getRelaxAmountFN(point);

      var xDelta = (centroid.x - point.x) * dampeningValue;
      var yDelta = (centroid.y - point.y) * dampeningValue;

      point.x = point.x + xDelta;
      point.y = point.y + yDelta;
    }
    else
    {
      point.x = centroid.x;
      point.y = centroid.y;
    }
  }
}
export function setVoronoiCells(cells: Voronoi.Cell<(FillerPoint | Star)>[]): void
{
  cells.forEach(cell =>
  {
    const castedSite = <Star> cell.site;
    const isFiller = !isFinite(castedSite.id);
    
    if (isFiller)
    {
      cell.site.voronoiCell = new VoronoiCell(<Voronoi.Cell<FillerPoint>> cell);
    }
    else
    {
      cell.site.voronoiCell = new VoronoiCell(<Voronoi.Cell<Star>> cell);
    }
  });
}

function getPolygonCentroid(vertices: Point[]): Point
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
