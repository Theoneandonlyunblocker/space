/// <reference path="../lib/offset.d.ts" />

import Star from "./Star.ts";
import Point from "./Point.ts";
import MapVoronoiInfo from "./MapVoronoiInfo.ts";
import Options from "./Options.ts";

import
{
  clamp,
  pointsEqual
} from "./utility.ts";

// some problems with this as well as pixi polygon rendering can lead to silly behavior sometimes.
// overlapping lines, acute angles etc etc.
// probably have to make a shader based version later but this could still be useful for canvas fallback.

export function starsOnlyShareNarrowBorder(a: Star, b: Star)
{
  var minBorderWidth = Options.display.borderWidth * 2;
  var edge = a.getEdgeWith(b);
  if (!edge)
  {
    return false;
  }
  var edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);

  if (edgeLength < minBorderWidth)
  {
    var sharedNeighbors = a.getSharedNeighborsWith(b);
    var sharedOwnedNeighbors = sharedNeighbors.filter(function(sharedNeighbor: Star)
    {
      return sharedNeighbor.owner === a.owner;
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
  var borderingHalfEdges:
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
    var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
    var isBorderWithOtherOwner =
      !oppositeSite || !oppositeSite.owner || (oppositeSite.owner !== halfEdge.site.owner);

    var isBorderWithSameOwner = false;
    if (!isBorderWithOtherOwner)
    {
      isBorderWithSameOwner = starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite) ||
        halfEdge.site.getDistanceToStar(oppositeSite) > 3;
    }

    return isBorderWithOtherOwner || isBorderWithSameOwner;
  }

  function halfEdgeSharesOwner(halfEdge: any)
  {
    var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
    var sharesOwner = Boolean(oppositeSite) && Boolean(oppositeSite.owner) &&
      (oppositeSite.owner === halfEdge.site.owner);

    return sharesOwner && !starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite);
  }

  function getContiguousHalfEdgeBetweenSharedSites(sharedEdge: any)
  {
    var contiguousEdgeEndPoint = sharedEdge.getStartpoint();
    var oppositeSite = getHalfEdgeOppositeSite(sharedEdge);
    for (var i = 0; i < oppositeSite.voronoiCell.halfedges.length; i++)
    {
      var halfEdge = oppositeSite.voronoiCell.halfedges[i];
      if (halfEdge.getStartpoint() === contiguousEdgeEndPoint)
      {
        return halfEdge;
      }
    }

    return false;
  }


  var startEdge: any;
  var star: Star;
  for (var i = 0; i < stars.length; i++)
  {
    if (star) break;

    for (var j = 0; j < stars[i].voronoiCell.halfedges.length; j++)
    {
      var halfEdge = stars[i].voronoiCell.halfedges[j];
      if (halfEdgeIsBorder(halfEdge))
      {
        star = stars[i];
        startEdge = halfEdge;
        break;
      }
    }
  }

  if (!star) throw new Error("Couldn't find starting location for border polygon");

  var hasProcessedStartEdge = false;
  var contiguousEdge: any = null;
  // just a precaution to make sure we don't get into an infinite loop
  // should always return earlier unless somethings wrong
  for (var j = 0; j < stars.length * 40; j++)
  {
    var indexShift = 0;
    for (var _i = 0; _i < star.voronoiCell.halfedges.length; _i++)
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
      var i = (_i + indexShift) % (star.voronoiCell.halfedges.length);

      var halfEdge = star.voronoiCell.halfedges[i];
      if (halfEdgeIsBorder(halfEdge))
      {
        borderingHalfEdges.push(
        {
          star: star,
          halfEdge: halfEdge
        });

        if (!startEdge)
        {
          startEdge = halfEdge
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

  throw new Error("getHalfEdgesConnectingStars got stuck in infinite loop when star id = " + star.id);
}
export function joinPointsWithin(points: Point[], maxDistance: number)
{
  for (var i = points.length - 2; i >= 0; i--)
  {
    var x1 = points[i].x;
    var y1 = points[i].y;

    var x2 = points[i+1].x;
    var y2 = points[i+1].y;

    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < maxDistance)
    {
      var newPoint: Point =
      {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
      }

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
  var convertedToPoints = halfEdgeData.map(function(data)
  {
    var v1 = data.halfEdge.getStartpoint();
    return(
    {
      x: v1.x,
      y: v1.y
    });
  });

  joinPointsWithin(convertedToPoints, Options.display.borderWidth / 2);

  var offset = new Offset();
  offset.arcSegments(0);
  var convertedToOffset = offset.data(convertedToPoints).padding(Options.display.borderWidth / 2);

  return convertedToOffset;
}
export function getRevealedBorderEdges(revealedStars: Star[], voronoiInfo: MapVoronoiInfo)
{
  var polyLines: any[][] = [];

  var processedStarsById:
  {
    [starId: number]: boolean;
  } = {};

  for (var ii = 0; ii < revealedStars.length; ii++)
  {
    var star = revealedStars[ii];
    if (processedStarsById[star.id])
    {
      continue;
    }

    if (!star.owner.isIndependent)
    {
      var ownedIsland = star.getIslandForQualifier(function(a: Star, b: Star)
      {
        // don't count stars if the only shared border between them is smaller than 10px
        return (a.owner === b.owner && !starsOnlyShareNarrowBorder(a, b));
      });
      var currentPolyLine: Point[] = [];

      var halfEdgesDataForIsland = getBorderingHalfEdges(ownedIsland);

      var offsetted = convertHalfEdgeDataToOffset(halfEdgesDataForIsland);

      // set stars
      for (var j = 0; j < offsetted.length; j++)
      {
        var point = <any> offsetted[j];
        var nextPoint = <any> offsetted[(j + 1) % offsetted.length];

        // offset library can't handle acute angles properly. can lead to crashes if
        // angle is at map edge due to points going off the map. clamping should fix crashes at least
        var edgeCenter: Point =
        {
          x: clamp((point.x + nextPoint.x) / 2, voronoiInfo.bounds.x1, voronoiInfo.bounds.x2),
          y: clamp((point.y + nextPoint.y) / 2, voronoiInfo.bounds.y1, voronoiInfo.bounds.y2)
        }

        var pointStar = point.star || voronoiInfo.getStarAtPoint(edgeCenter);
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
      var startIndex: number = 0; // default = all stars of polygon are revealed

      for (var j = 0; j < offsetted.length; j++)
      {
        var currPoint = <any> offsetted[j];
        var prevPoint = <any> offsetted[(j === 0 ? offsetted.length - 1 : j - 1)];
        if (revealedStars.indexOf(currPoint.star) !== -1 && revealedStars.indexOf(prevPoint.star) === -1)
        {
          startIndex = j;
        }
      }

      // get polylines
      for (var _j = startIndex; _j < offsetted.length + startIndex; _j++)
      {
        var j = _j % offsetted.length;
        var point = <any> offsetted[j];

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

  var polyLinesData:
  {
    points: any[];
    isClosed: boolean;
  }[] = [];

  for (var i = 0; i < polyLines.length; i++)
  {
    var polyLine = polyLines[i];
    var isClosed = pointsEqual(polyLine[0], polyLine[polyLine.length - 1]);
    if (isClosed) polyLine.pop();
    for (var j = 0; j < polyLine.length; j++)
    {
      // stupid hack to fix pixi bug with drawing polygons
      // without this consecutive edges with the same angle disappear
      polyLine[j].x += (j % 2) * 0.1;
      polyLine[j].y += (j % 2) * 0.1;
    }
    polyLinesData.push(
    {
      points: polyLine,
      isClosed: isClosed
    });
  }

  return polyLinesData;
}
