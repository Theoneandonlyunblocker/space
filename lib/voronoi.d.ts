interface Bbox
{
  xl: number;
  xr: number;
  yt: number;
  yb: number;
}
interface Bbox2 // no idea why theres 2
{
  x: number;
  y: number;
  width: number;
  height: number;
}

declare class Voronoi
{
  constructor();
  compute<T extends Voronoi.Vertex>(sites: T[], bbox: Bbox): Voronoi.Result<T>;
  
  Cell: Voronoi.CellConstructor<any>;
}

declare module Voronoi
{
  export interface Vertex
  {
    x: number;
    y: number;
  }
  export interface Result<T extends Vertex>
  {
    vertices: Vertex[];
    edges: Edge<T>[];
    cells: Cell<T>[];
    
    execTime: number;
  }
  export interface Edge<T extends Vertex>
  {
    lSite: T;
    rSite: T;
    va: Vertex;
    vb: Vertex;
  }
  export interface Cell<T extends Vertex>
  {
    site: T;
    halfedges: HalfEdge<T>[];
    getNeighborIds(): number[];
    getBbox(): Bbox2;
    pointIntersection(x: number, y: number): number;
  }
  interface CellConstructor<T extends Vertex>
  {
    new(site: T): Cell<T>;
  }
  export interface HalfEdge<T extends Vertex>
  {
    site: T;
    edge: Edge<T>;
    getStartpoint(): Vertex;
    getEndpoint(): Vertex;
  }
}
