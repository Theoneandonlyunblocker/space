/// <reference path="../../data/templates/resourcetemplates.ts" />

/// <reference path="../star.ts" />

module Rance
{
  export module MapGen2
  {
    export class Sector2
    {
      id: number;
      stars: Star[] = [];
      resourceType: Templates.IResourceTemplate;
      resourceLocation: Star;

      constructor(id: number)
      {
        this.id = id
      }
      addStar(star: Star)
      {
        if (star.mapGenData.sector)
        {
          throw new Error("Star already part of a sector");
        }

        this.stars.push(star);
        star.mapGenData.sector = this;
      }

      getNeighboringStars()
      {
        var neighbors: Star[] = [];
        var alreadyAdded:
        {
          [starId: number]: boolean;
        } = {};

        for (var i = 0; i < this.stars.length; i++)
        {
          var frontier = this.stars[i].getLinkedInRange(1).all;
          for (var j = 0; j < frontier.length; j++)
          {
            if (frontier[j].mapGenData.sector !== this && !alreadyAdded[frontier[j].id])
            {
              neighbors.push(frontier[j]);
              alreadyAdded[frontier[j].id] = true;
            }
          }
        }

        return neighbors;
      }

      getMajorityRegions()
      {
        var regionsByStars:
        {
          [regionId: string]:
          {
            count: number;
            region: Region2;
          };
        } = {};

        var biggestRegionStarCount = 0;
        for (var i = 0; i < this.stars.length; i++)
        {
          var star = this.stars[i];
          var region = star.mapGenData.region;

          if (!regionsByStars[region.id])
          {
            regionsByStars[region.id] =
            {
              count: 0,
              region: region
            }
          }

          regionsByStars[region.id].count++;

          if (regionsByStars[region.id].count > biggestRegionStarCount)
          {
            biggestRegionStarCount = regionsByStars[region.id].count;
          }
        }

        var majorityRegions: Region2[] = [];
        for (var regionId in regionsByStars)
        {
          if (regionsByStars[regionId].count >= biggestRegionStarCount)
          {
            majorityRegions.push(regionsByStars[regionId].region);
          }
        }

        return majorityRegions;
      }
    }
  }
}
