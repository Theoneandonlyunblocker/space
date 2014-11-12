/// <reference path="vertex.ts" />
/// <reference path="triangle.ts" />

module Rance
{
  export class HalfEdge
  {
    vertex: Vertex;
    oppositeEdge: HalfEdge;
    ccwEdge: HalfEdge;
    face

    constructor(public x: number, public y: number)
    {

    }
  }
}
