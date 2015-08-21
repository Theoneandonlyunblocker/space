/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="mapgen/mapgenresult.ts" />
/// <reference path="game.ts" />
/// <reference path="point.ts" />
/// <reference path="star.ts" />
/// <reference path="mapvoronoiinfo.ts" />


module Rance
{
  export class GalaxyMap
  {
    stars: Star[];
    fillerPoints: Star[]; // TODO change filler points to Point
    width: number;
    height: number;

    voronoi: MapVoronoiInfo;

    // TODO remove
    game: Game;
    // TODO end
    constructor(mapGen: MapGen2.MapGenResult)
    {
      this.width = mapGen.width;
      this.height = mapGen.height;

      this.stars = mapGen.stars;
      this.fillerPoints = mapGen.fillerPoints;

      this.voronoi = mapGen.voronoiInfo;
    }
    getAllPoints(): Star[]
    {
      return this.fillerPoints.concat(this.stars);
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

      data.allPoints = this.getAllPoints().map(function(star)
      {
        return star.serialize();
      });

      data.maxWidth = this.width / 2;
      data.maxHeight = this.height / 2;

      return data;
    }
  }
}
