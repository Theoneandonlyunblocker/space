/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="star.ts" />
/// <reference path="mapgen.ts" />

module Rance
{
  export class GalaxyMap
  {
    stars: Star[];
    mapGen: MapGen;
    constructor()
    {

    }

    addMapGen(mapGen: MapGen)
    {
      this.mapGen = mapGen;

      this.stars = mapGen.points;
    }
  }
}
