/// <reference path="../lib/offset.d.ts" />

module Rance
{
  export function getBorderingHalfEdges(stars: Star[])
  {
    var borderingHalfEdges:
    {
      star: Star;
      halfEdge: any;
    }[] = [];

    function getHalfEdgeOppositeSite(halfEdge)
    {
      return halfEdge.edge.lSite === halfEdge.site ?
        halfEdge.edge.rSite : halfEdge.edge.lSite;
    }

    function halfEdgeIsBorder(halfEdge: any)
    {
      var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
      return !oppositeSite || !oppositeSite.owner || (oppositeSite.owner !== halfEdge.site.owner);
    }

    function halfEdgeSharesOwner(halfEdge: any)
    {
      var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
      return Boolean(oppositeSite) && Boolean(oppositeSite.owner) &&
        (oppositeSite.owner === halfEdge.site.owner);
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
    var contiguousEdge = null;
    // just a precaution to make sure we don't get into an infinite loop
    // should always return earlier unless somethings wrong
    for (var j = 0; j < stars.length * 20; j++)
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
    return borderingHalfEdges;
  }
  export function joinPointsWithin(points: any[], maxDistance: number)
  {
    for (var i = points.length - 2; i >= 0; i--)
    {
      var x1 = points[i].x;
      var y1 = points[i].y;

      var x2 = points[i+1].x;
      var y2 = points[i+1].y;

      if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < maxDistance)
      {
        var newPoint =
        {
          x: (x1 + x2) / 2,
          y: (y1 + y2) / 2,
          data: points[i].data
        }

        console.log("joined points at", points[i].data.id);

        points.splice(i, 2, newPoint);
      }
    }
  }
  export function convertHalfEdgeDataToOffset(halfEdgeData)
  {
    var convertedToPoints = halfEdgeData.map(function(data)
    {
      var v1 = data.halfEdge.getStartpoint();
      return(
      {
        x: v1.x,
        y: v1.y,
        data: data.star
      });
    });

    joinPointsWithin(convertedToPoints, 5);

    var offset = new Offset(halfEdgeData[0].star);
    offset.arcSegments(0);
    var convertedToOffset = offset.data(convertedToPoints).padding(4);

    return convertedToOffset;
  }
  export function getRevealedBorderEdges(revealedStars: Star[])
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
          return b.owner === a.owner;
        });
        // console.log("island", ownedIsland[0].owner.id);
        var currentPolyLine = [];

        var halfEdgesDataForIsland = getBorderingHalfEdges(ownedIsland);
        // console.log("halfEdgeData", halfEdgesDataForIsland[0].star.owner.id);
        var offsetted = convertHalfEdgeDataToOffset(halfEdgesDataForIsland);
        // console.log("offsetted", offsetted[0].data.owner.id);
        for (var jj = offsetted.length - 1; jj >= 0; jj--)
        {
          if (!offsetted[jj].data) console.log("!!!NODATA")
          if (revealedStars.indexOf(offsetted[jj].data) === -1)
          {
            if (currentPolyLine.length > 0)
            {
              polyLines.push(currentPolyLine);
              currentPolyLine = [];
            }
            offsetted.splice(jj, 1);
          }
          else
          {
            currentPolyLine.push(offsetted[jj]);
            processedStarsById[offsetted[jj].data.id] = true;
          }
        }
        if (currentPolyLine.length > 0)
        {
          polyLines.push(currentPolyLine);
        }
      }
    }

    return polyLines;
  }
}