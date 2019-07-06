// TODO global ref
// /// <reference path="../lib/voronoi.d.ts" />

import {Point} from "./Point";


export class VoronoiCell<T extends Point> extends Voronoi.prototype.Cell
{
  public vertices: Voronoi.Vertex[];

  // bounding box
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(cell: Voronoi.Cell<T>)
  {
    super(cell.site);

    this.halfedges = cell.halfedges;

    const bbox = cell.getBbox();

    this.x = bbox.x;
    this.y = bbox.y;
    this.width = bbox.width;
    this.height = bbox.height;

    this.vertices = cell.halfedges.map(halfEdge =>
    {
      return halfEdge.getStartpoint();
    });
  }
}
