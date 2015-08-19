/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="game.ts" />
/// <reference path="star.ts" />
/// <reference path="mapvoronoiinfo.ts" />


module Rance
{
  export class GalaxyMap
  {
    allPoints: Star[];
    stars: Star[];
    width: number;
    height: number;

    voronoi: MapVoronoiInfo;

    // TODO remove
    game: Game;
    // TODO end
    constructor()
    {
    }

    setMapGen(mapGen: MapGen)
    {
      this.width = mapGen.maxWidth * 2;
      this.height = mapGen.maxHeight * 2;

      this.allPoints = mapGen.points;
      this.stars = mapGen.getNonFillerPoints();

      this.voronoi = new MapVoronoiInfo();
      this.voronoi.treeMap = mapGen.voronoiTreeMap;
      this.voronoi.diagram = mapGen.voronoiDiagram;
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

      data.maxWidth = this.width / 2;
      data.maxHeight = this.height / 2;

      return data;
    }
  }
}
