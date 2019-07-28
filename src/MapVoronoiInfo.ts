import * as QuadTree from "quadtree-lib";
import * as Voronoi from "voronoi";

import {FillerPoint} from "./FillerPoint";
import {Point} from "./Point";
import {Star} from "./Star";
import {VoronoiCell} from "./VoronoiCell";


export class MapVoronoiInfo
{
  treeMap: QuadTree<VoronoiCell<Star>>;
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
  public getNonFillerVoronoiLines(visibleStars: Star[] | null)
  {
    if (!this.diagram)
    {
      return [];
    }

    let indexString = "";
    if (!visibleStars)
    {
      indexString = "all";
    }
    else
    {
      const ids: number[] = visibleStars.map(star => star.id);
      ids.sort();

      indexString = ids.join();
    }

    if (!this.nonFillerLines[indexString] ||
      this.nonFillerLines[indexString].length <= 0)
    {
      this.nonFillerLines[indexString] = this.diagram.edges.filter(edge =>
      {
        const adjacentSites = [edge.lSite, edge.rSite];
        let adjacentFillerSites = 0;
        let maxAllowedFillerSites = 2;

        for (let i = 0; i < adjacentSites.length; i++)
        {
          const site = adjacentSites[i];

          if (!site)
          {
            // draw all border edges
            // return true;

            // draw all non filler border edges
            maxAllowedFillerSites--;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
            continue;
          }


          if (visibleStars && visibleStars.indexOf(<Star> site) < 0)
          {
            maxAllowedFillerSites--;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
            continue;
          }

          const castedSite = <Star> site;
          const isFiller = !isFinite(castedSite.id);
          if (isFiller)
          {
            adjacentFillerSites++;
            if (adjacentFillerSites >= maxAllowedFillerSites)
            {
              return false;
            }
          }
        }

        return true;
      });
    }

    return this.nonFillerLines[indexString];
  }
  // TODO 2017.08.16 | this should be in modules. would allow non-voronoi maps
  public getStarAtPoint(point: Point): Star
  {
    const items = this.treeMap.colliding(point);
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
