import Star from "./Star";
import Point from "./Point";

export default class MapVoronoiInfo
{
  treeMap: any;
  diagram: any;
  nonFillerLines:
  {
    [visibility: string]: any[];
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
  getNonFillerVoronoiLines(visibleStars?: Star[])
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
        this.diagram.edges.filter(function(edge: any)
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


          if (visibleStars && visibleStars.indexOf(site) < 0)
          {
            maxAllowedFillerSites--;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
            continue;
          };


          if (!isFinite(site.id)) // is filler
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
  getStarAtPoint(point: Point)
  {
    var items = this.treeMap.retrieve(point);
    for (let i = 0; i < items.length; i++)
    {
      var cell = items[i].cell;
      if (cell.pointIntersection(point.x, point.y) > -1)
      {
        return cell.site;
      }
    }

    return null;
  }
}
