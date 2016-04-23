import Star from "../../../src/Star";
import FillerPoint from "../../../src/FillerPoint";

export default class Region
{
  id: string;
  isFiller: boolean;
  stars: Star[] = [];
  fillerPoints: FillerPoint[] = [];

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
  addFillerPoint(point: FillerPoint)
  {
    this.fillerPoints.push(point);
    point.mapGenData.region
  }
  severLinksByQualifier(qualifierFN: (a: Star, b: Star) => boolean)
  {
    for (let i = 0; i < this.stars.length; i++)
    {
      var star = this.stars[i];
      var links = star.getAllLinks();
      for (let j = 0; j < links.length; j++)
      {
        if (qualifierFN(star, links[j]))
        {
          star.removeLink(links[j]);
        }
      }
    }
  }
  severLinksToRegionsExcept(exemptRegions: Region[])
  {
    this.severLinksByQualifier(function(a: Star, b: Star)
    {
      return exemptRegions.indexOf(b.mapGenData.region) !== -1;
    });
  }
}
