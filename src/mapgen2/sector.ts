/// <reference path="../templateinterfaces/iresourcetemplate.d.ts" />
/// <reference path="../star.ts" />

module Rance
{
  export module MapGen2
  {
    export class Sector
    {
      id: number;
      stars: Star[] = [];
      distributionFlags: string[];
      resourceType: Templates.IResourceTemplate;
      resourceLocation: Star;
      addedDistributables: Templates.IDistributable[] = [];

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
      addResource(resource: Templates.IResourceTemplate)
      {
        var star = this.stars[0];

        this.resourceType = resource;
        this.resourceLocation = star;
        star.setResource(resource);
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

      getNeighboringSectors()
      {
        var sectors: Sector[] = [];
        var alreadyAdded:
        {
          [sectorId: number]: boolean;
        } = {};

        var neighborStars = this.getNeighboringStars();

        for (var i = 0; i < neighborStars.length; i++)
        {
          var sector = neighborStars[i].mapGenData.sector;
          if (!alreadyAdded[sector.id])
          {
            alreadyAdded[sector.id] = true;
            sectors.push(sector);
          }
        }

        return sectors;
      }

      getMajorityRegions()
      {
        var regionsByStars:
        {
          [regionId: string]:
          {
            count: number;
            region: Region;
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

        var majorityRegions: Region[] = [];
        for (var regionId in regionsByStars)
        {
          if (regionsByStars[regionId].count >= biggestRegionStarCount)
          {
            majorityRegions.push(regionsByStars[regionId].region);
          }
        }

        return majorityRegions;
      }
      getPerimeterLengthWithStar(star: Star): number
      {
        var perimeterLength: number = 0;

        for (var i = 0; i < this.stars.length; i++)
        {
          var ownStar = this.stars[i];
          var halfEdges = ownStar.voronoiCell.halfedges;
          for (var j = 0; j < halfEdges.length; j++)
          {
            var edge = halfEdges[j].edge;
            if (edge.lSite === star || edge.rSite === star)
            {
              var edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);
              perimeterLength += edgeLength;
            }
          }
        }

        return perimeterLength;
      }
    }
  }
}
