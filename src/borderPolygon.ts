import * as Offset from "polygon-offset";

import {MapVoronoiInfo} from "./MapVoronoiInfo";
import {Point} from "./Point";
import {Star} from "./Star";

import
{
  clamp,
  pointsEqual,
} from "./utility";


export const borderWidth = 8;

// some problems with this as well as pixi polygon rendering can lead to silly behavior sometimes.
// overlapping lines, acute angles etc etc.
// probably have to make a shader based version later but this could still be useful for canvas fallback.

export function starsOnlyShareNarrowBorder(a: Star, b: Star)
{
  const minBorderWidth = borderWidth * 2;
  const edge = a.getEdgeWith(b);
  if (!edge)
  {
    return false;
  }
  const edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);

  if (edgeLength < minBorderWidth)
  {
    const sharedNeighborPoints = a.getSharedNeighborsWith(b);
    const sharedOwnedNeighbors = sharedNeighborPoints.filter((sharedNeighborPoint): sharedNeighborPoint is Star =>
    {
      return Boolean((sharedNeighborPoint as Star).owner);
    }).filter(sharedNeighborStar =>
    {
      return sharedNeighborStar.owner === a.owner;
    });

    return sharedOwnedNeighbors.length === 0;
  }
  else
  {
    return false;
  }
}
export function getBorderingHalfEdges(stars: Star[])
{
  const borderingHalfEdges:
  {
    star: Star;
    halfEdge: any;
  }[] = [];

  function getHalfEdgeOppositeSite(halfEdge: any)
  {
    return halfEdge.edge.lSite === halfEdge.site ?
      halfEdge.edge.rSite : halfEdge.edge.lSite;
  }

  function halfEdgeIsBorder(halfEdge: any)
  {
    const oppositeSite = getHalfEdgeOppositeSite(halfEdge);
    const isBorderWithOtherOwner =
      !oppositeSite || !oppositeSite.owner || (oppositeSite.owner !== halfEdge.site.owner);

    let isBorderWithSameOwner = false;
    if (!isBorderWithOtherOwner)
    {
      isBorderWithSameOwner = starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite) ||
        halfEdge.site.getDistanceToStar(oppositeSite) > 3;
    }

    return isBorderWithOtherOwner || isBorderWithSameOwner;
  }

  function halfEdgeSharesOwner(halfEdge: any)
  {
    const oppositeSite = getHalfEdgeOppositeSite(halfEdge);
    const sharesOwner = Boolean(oppositeSite) && Boolean(oppositeSite.owner) &&
      (oppositeSite.owner === halfEdge.site.owner);

    return sharesOwner && !starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite);
  }

  function getContiguousHalfEdgeBetweenSharedSites(sharedEdge: any)
  {
    const contiguousEdgeEndPoint = sharedEdge.getStartpoint();
    const oppositeSite = getHalfEdgeOppositeSite(sharedEdge);
    for (let i = 0; i < oppositeSite.voronoiCell.halfedges.length; i++)
    {
      const halfEdge = oppositeSite.voronoiCell.halfedges[i];
      if (halfEdge.getStartpoint() === contiguousEdgeEndPoint)
      {
        return halfEdge;
      }
    }

    return false;
  }


  let startEdge: any;
  let star: Star | undefined;
  for (let i = 0; i < stars.length; i++)
  {
    if (star)
    {
      break;
    }

    for (let j = 0; j < stars[i].voronoiCell.halfedges.length; j++)
    {
      const halfEdge = stars[i].voronoiCell.halfedges[j];
      if (halfEdgeIsBorder(halfEdge))
      {
        star = stars[i];
        startEdge = halfEdge;
        break;
      }
    }
  }

  if (!star)
  {
    throw new Error("Couldn't find starting location for border polygon");
  }

  let hasProcessedStartEdge = false;
  let contiguousEdge: any = null;
  // just a precaution to make sure we don't get into an infinite loop
  // should always return earlier unless somethings wrong
  for (let j = 0; j < stars.length * 40; j++)
  {
    let indexShift = 0;
    for (let _i = 0; _i < star.voronoiCell.halfedges.length; _i++)
    {
      if (!hasProcessedStartEdge)
      {
        contiguousEdge = startEdge;
      }
      if (contiguousEdge)
      {
        indexShift = star.voronoiCell.halfedges.indexOf(contiguousEdge);
        contiguousEdge = null;
      }
      const i = (_i + indexShift) % (star.voronoiCell.halfedges.length);

      const halfEdge = star.voronoiCell.halfedges[i];
      if (halfEdgeIsBorder(halfEdge))
      {
        borderingHalfEdges.push(
        {
          star: star,
          halfEdge: halfEdge,
        });

        if (!startEdge)
        {
          startEdge = halfEdge;
        }
        else if (halfEdge === startEdge)
        {
          if (!hasProcessedStartEdge)
          {
            hasProcessedStartEdge = true;
          }
          else
          {
            return borderingHalfEdges;
          }
        }
      }
      else if (halfEdgeSharesOwner(halfEdge))
      {
        contiguousEdge = getContiguousHalfEdgeBetweenSharedSites(halfEdge);
        star = contiguousEdge.site;
        break;
      }
    }
  }

  throw new Error(`getHalfEdgesConnectingStars got stuck in infinite loop when star id = ${star.id}`);
}
export function joinPointsWithin(points: Point[], maxDistance: number)
{
  for (let i = points.length - 2; i >= 0; i--)
  {
    const x1 = points[i].x;
    const y1 = points[i].y;

    const x2 = points[i + 1].x;
    const y2 = points[i + 1].y;

    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < maxDistance)
    {
      const newPoint: Point =
      {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
      };

      points.splice(i, 2, newPoint);
    }
  }
}
export function convertHalfEdgeDataToOffset(halfEdgeData:
{
  star: Star;
  halfEdge: any;
}[])
{
  const convertedToPoints = halfEdgeData.map(data =>
  {
    const v1 = data.halfEdge.getStartpoint();

    return(
    {
      x: v1.x,
      y: v1.y,
    });
  });

  joinPointsWithin(convertedToPoints, borderWidth / 2);

  const offset = new Offset();
  offset.arcSegments(0);
  const convertedToOffset = offset.data(convertedToPoints).padding(borderWidth / 2);

  return convertedToOffset;
}
export function getRevealedBorderEdges(revealedStars: Star[], voronoiInfo: MapVoronoiInfo)
{
  const polyLines: any[][] = [];

  const processedStarsById:
  {
    [starId: number]: boolean;
  } = {};

  for (let ii = 0; ii < revealedStars.length; ii++)
  {
    const star = revealedStars[ii];
    if (processedStarsById[star.id])
    {
      continue;
    }

    if (!star.owner.isIndependent)
    {
      const ownedIsland = Star.getIslandForQualifier([star], null, (a: Star, b: Star) =>
      {
        // don't count stars if the only shared border between them is smaller than 10px
        return (a.owner === b.owner && !starsOnlyShareNarrowBorder(a, b));
      });
      let currentPolyLine: Point[] = [];

      const halfEdgesDataForIsland = getBorderingHalfEdges(ownedIsland);

      const offsetted = convertHalfEdgeDataToOffset(halfEdgesDataForIsland);

      // set stars
      for (let j = 0; j < offsetted.length; j++)
      {
        const point = <any> offsetted[j];
        const nextPoint = <any> offsetted[(j + 1) % offsetted.length];

        // offset library can't handle acute angles properly. can lead to crashes if
        // angle is at map edge due to points going off the map. clamping should fix crashes at least
        const edgeCenter: Point =
        {
          x: clamp((point.x + nextPoint.x) / 2, voronoiInfo.bounds.x1, voronoiInfo.bounds.x2),
          y: clamp((point.y + nextPoint.y) / 2, voronoiInfo.bounds.y1, voronoiInfo.bounds.y2),
        };

        let pointStar = point.star || voronoiInfo.getStarAtPoint(edgeCenter);
        if (!pointStar)
        {
          pointStar = voronoiInfo.getStarAtPoint(point);
          if (!pointStar)
          {
            pointStar = voronoiInfo.getStarAtPoint(nextPoint);
          }
        }
        processedStarsById[pointStar.id] = true;
        point.star = pointStar;
      }

      // find first point in revealed star preceded by unrevealed star
      // set that point as start of polygon
      let startIndex: number = 0; // default = all stars of polygon are revealed

      for (let j = 0; j < offsetted.length; j++)
      {
        const currPoint = <any> offsetted[j];
        const prevPoint = <any> offsetted[(j === 0 ? offsetted.length - 1 : j - 1)];
        if (revealedStars.indexOf(currPoint.star) !== -1 && revealedStars.indexOf(prevPoint.star) === -1)
        {
          startIndex = j;
        }
      }

      // get polylines
      for (let _j = startIndex; _j < offsetted.length + startIndex; _j++)
      {
        const j = _j % offsetted.length;
        const point = <any> offsetted[j];

        if (revealedStars.indexOf(point.star) === -1)
        {
          if (currentPolyLine.length > 1)
          {
            currentPolyLine.push(point);
            polyLines.push(currentPolyLine);
            currentPolyLine = [];
          }
        }
        else
        {
          currentPolyLine.push(point);
        }
      }
      if (currentPolyLine.length > 1)
      {
        polyLines.push(currentPolyLine);
      }
    }
  }

  const polyLinesData:
  {
    points: any[];
    isClosed: boolean;
  }[] = [];

  for (let i = 0; i < polyLines.length; i++)
  {
    const polyLine = polyLines[i];
    const isClosed = pointsEqual(polyLine[0], polyLine[polyLine.length - 1]);
    if (isClosed) { polyLine.pop(); }
    for (let j = 0; j < polyLine.length; j++)
    {
      // stupid hack to fix pixi bug with drawing polygons
      // without this consecutive edges with the same angle disappear
      polyLine[j].x += (j % 2) * 0.1;
      polyLine[j].y += (j % 2) * 0.1;
    }
    polyLinesData.push(
    {
      points: polyLine,
      isClosed: isClosed,
    });
  }

  return polyLinesData;
}
