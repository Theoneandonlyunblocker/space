/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="star.ts" />
/// <reference path="mapgen.ts" />
/// <reference path="maprenderer.ts" />

module Rance
{
  export class GalaxyMap
  {
    allPoints: Star[];
    stars: Star[];
    mapGen: MapGen;
    mapRenderer: MapRenderer;
    game: Game;
    constructor()
    {
    }

    setMapGen(mapGen: MapGen)
    {
      this.mapGen = mapGen;

      this.allPoints = mapGen.points;
      this.stars = mapGen.getNonFillerPoints();
    }
    getIncomeBounds()
    {
      var min, max;

      for (var i = 0; i < this.stars.length; i++)
      {
        var star = this.stars[i];
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
    serialize()
    {
      var data: any = {};

      data.allPoints = this.allPoints.map(function(star)
      {
        return star.serialize();
      });

      data.regionNames = [];

      for (var name in this.mapGen.regions)
      {
        data.regionNames.push(name);
      }

      return data;
    }
  }
}
