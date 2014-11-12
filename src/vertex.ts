/// <reference path="halfedge.ts" />

module Rance
{
  export class Vertex
  {
    halfEdge: HalfEdge;

    constructor(public x: number, public y: number)
    {

    }
  }
}
