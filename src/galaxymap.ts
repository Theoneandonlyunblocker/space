/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="star.ts" />
/// <reference path="mapgen.ts" />
/// <reference path="maprenderer.ts" />
/// <reference path="region.ts" />
/// <reference path="sector.ts" />

module Rance
{
  export class GalaxyMap
  {
    allPoints: Star[];
    stars: Star[];
    sectors:
    {
      [sectorId: number]: Sector;
    };
    regions:
    {
      [regionId: string]: Region;
    };
    mapGen: MapGen;
    width: number;
    height: number;
    mapRenderer: MapRenderer;
    game: Game;
    constructor()
    {
    }

    setMapGen(mapGen: MapGen)
    {
      this.mapGen = mapGen;

      this.width = mapGen.maxWidth * 2;
      this.height = mapGen.maxHeight * 2;

      this.allPoints = mapGen.points;
      this.stars = mapGen.getNonFillerPoints();
      this.sectors = mapGen.sectors;
      this.regions = mapGen.regions;
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

      data.regions = [];

      for (var regionId in this.regions)
      {
        data.regions.push(this.regions[regionId].serialize());
      }

      data.sectors = [];

      for (var sectorId in this.sectors)
      {
        data.sectors.push(this.sectors[sectorId].serialize());
      }

      data.maxWidth = this.mapGen.maxWidth;
      data.maxHeight = this.mapGen.maxHeight;

      return data;
    }
  }
}
