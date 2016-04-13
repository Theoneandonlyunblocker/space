/// <reference path="../../lib/voronoi.d.ts" />

import Triangle from "./Triangle";
import Point from "../Point";

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
 * @param {(Point) => number} dampeningFunction If specified, use value returned by dampeningFunction(cell.site)
 *                                            to adjust how far towards centroid the point is moved.
 *                                            0.0 = not moved, 0.5 = moved halfway, 1.0 = moved fully
 */
export function relaxVoronoi(diagram: any, dampeningFunction?: (point: Point) => number)
{
  for (var i = 0; i < diagram.cells.length; i++)
  {
    var cell = diagram.cells[i];
    var point = cell.site;
    var centroid = getPolygonCentroid(cell.vertices);
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

function getVerticesFromCell(cell: any)
{
  var vertices: Point[] = [];

  for (var i = 0; i < cell.halfedges.length; i++)
  {
    vertices.push(cell.halfedges[i].getStartpoint());
  }

  return vertices;
}
