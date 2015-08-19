/// <reference path="../star.ts" />

module Rance
{
  export module MapGen2
  {
    export class Region
    {
      id: string;
      isFiller: boolean;
      stars: Star[] = [];

      constructor(id: string, isFiller: boolean)
      {
        this.id = id;
        this.isFiller = isFiller;
      }
      addStar(star: Star)
      {
        this.stars.push(star);
        star.mapGenData.region = this;
      }
      severLinksByQualifier(qualifierFN: (a: Star, b: Star) => boolean)
      {
        for (var i = 0; i < this.stars.length; i++)
        {
          var star = this.stars[i];
          var links = star.getAllLinks();
          for (var j = 0; j < links.length; j++)
          {
            if (qualifierFN(star, links[j]))
            {
              star.removeLink(links[j]);
            }
          }
        }
      }
      severLinksToFiller()
      {
        this.severLinksByQualifier(function(a: Star, b: Star)
        {
          return b.mapGenData.region.isFiller;
        });
      }
      severLinksToRegionsExcept(exemptRegions: Region[])
      {
        this.severLinksByQualifier(function(a: Star, b: Star)
        {
          return exemptRegions.indexOf(b.mapGenData.region) !== -1;
        });
      }
      // TODO REMOVE
      severLinksToNonCenter()
      {
        this.severLinksByQualifier(function(a: Star, b: Star)
        {
          return (a.mapGenData.region !== b.mapGenData.region &&
            b.mapGenData.region.id.indexOf("center") < 0
          );
        });
      }
      // END TO REMOVE
    }
  }
}
