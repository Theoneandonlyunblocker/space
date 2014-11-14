/// <reference path="point.ts" />

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.star = idGenerators.star || 0;

  export class Star implements Point
  {
    id: number;
    x: number;
    y: number;
    isFiller: boolean = false;
    linksTo: Star[] = [];
    linksFrom: Star[] = [];
    distance: number;
    region: string;
    constructor(x: number, y: number, id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.star++;

      this.x = x;
      this.y = y;
    }
    setPosition(x: number, y: number)
    {
      this.x = x;
      this.y = y;
    }
    hasLink(linkTo: Star)
    {
      return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
    }
    addLink(linkTo: Star)
    {
      if (this.hasLink(linkTo)) return;

      this.linksTo.push(linkTo);
      linkTo.linksFrom.push(this);
    }
    removeLink(linkTo: Star)
    {
      if (!this.hasLink(linkTo)) return;

      var toIndex = this.linksTo.indexOf(linkTo);
      if (toIndex >= 0)
      {
        this.linksTo.splice(toIndex, 1);
      }
      else
      {
        this.linksFrom.splice(this.linksFrom.indexOf(linkTo), 1);
      }

      linkTo.removeLink(this);
    }
    getAllLinks()
    {
      return this.linksTo.concat(this.linksFrom);
    }
    clearLinks()
    {
      this.linksTo = [];
      this.linksFrom = [];
    }
    getLinksByRegion()
    {
      var linksByRegion:
      {
        [regionId: string]: Star[];
      } = {};

      var allLinks = this.getAllLinks();

      for (var i = 0; i < allLinks.length; i++)
      {
        var star = allLinks[i];
        var region = star.region;

        if (!linksByRegion[region])
        {
          linksByRegion[region] = [];
        }

        linksByRegion[region].push(star);
      }

      return linksByRegion;
    }
    severLinksToRegion(regionToSever: string)
    {
      var linksByRegion = this.getLinksByRegion();
      var links = linksByRegion[regionToSever];

      for (var i = 0; i < links.length; i++)
      {
        var star = links[i];

        this.removeLink(star);
      }
    }
    severLinksToFiller()
    {
      var linksByRegion = this.getLinksByRegion();
      var fillerRegions = Object.keys(linksByRegion).filter(function(region)
      {
        return region.indexOf("filler") >= 0;
      });

      for (var i = 0; i < fillerRegions.length; i++)
      {
        this.severLinksToRegion(fillerRegions[i]);      
      }
    }
  }
}
