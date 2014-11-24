/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="star.ts" />
/// <reference path="mapgen.ts" />
/// <reference path="maprenderer.ts" />

module Rance
{
  export class GalaxyMap
  {
    stars: Star[];
    mapGen: MapGen;
    mapRenderer: MapRenderer;
    constructor()
    {

    }

    setMapGen(mapGen: MapGen)
    {
      this.mapGen = mapGen;

      this.stars = mapGen.points;
    }
    getIncomeBounds()
    {
      var min, max;

      for (var i = 0; i < this.mapGen.points.length; i++)
      {
        var star = this.mapGen.points[i];
        var income = star.getIncome();
        if (!min) min = max = income;
        else
        {
          if (income < min) min = income;
          else if (income > max) max = income;
        }
      }

      return(
      {
        min: min,
        max: max
      });
    }
  }
}
