/// <reference path="../lib/voronoi.d.ts" />

import VoronoiCell from "./VoronoiCell";
import Star from "./Star";
import Point from "./Point";
import FillerPoint from "./FillerPoint";

export default class MapVoronoiInfo
{
  treeMap: BoundsQuadTree<VoronoiCell<Star>>;
  diagram: Voronoi.Result<Star | FillerPoint>;
  nonFillerLines:
  {
    [visibility: string]: Voronoi.Edge<Star | FillerPoint>[];
  } = {};
  bounds:
  {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };

  constructor()
  {
    
  }
  public getNonFillerVoronoiLines(visibleStars?: Star[])
  {
    if (!this.diagram) return [];

    var indexString = "";
    if (!visibleStars) indexString = "all";
    else
    {
      var ids: number[] = visibleStars.map(function(star){return star.id});
      ids = ids.sort();

      indexString = ids.join();
    }

    if (!this.nonFillerLines[indexString] ||
      this.nonFillerLines[indexString].length <= 0)
    {
      this.nonFillerLines[indexString] =
        this.diagram.edges.filter(function(edge)
      {
        var adjacentSites = [edge.lSite, edge.rSite];
        var adjacentFillerSites = 0;
        var maxAllowedFillerSites = 2;

        for (let i = 0; i < adjacentSites.length; i++)
        {
          var site = adjacentSites[i];

          if (!site)
          {
            // draw all border edges
            //return true;

            // draw all non filler border edges
            maxAllowedFillerSites--;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
            continue;
          };


          if (visibleStars && visibleStars.indexOf(<Star> site) < 0)
          {
            maxAllowedFillerSites--;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
            continue;
          };

          const castedSite = <Star> site;
          const isFiller = !isFinite(castedSite.id);
          if (isFiller)
          {
            adjacentFillerSites++;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
          };
        }

        return true;
      });
    }

    return this.nonFillerLines[indexString];
  }
  public getStarAtPoint(point: Point): Star
  {
    var items = this.treeMap.retrieve(point);
    for (let i = 0; i < items.length; i++)
    {
      if (items[i].pointIntersection(point.x, point.y) > -1)
      {
        return items[i].site;
      }
    }

    return null;
  }
}
