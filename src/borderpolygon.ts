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
  export function convertHalfEdgeDataToOffset(halfEdgeData)
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

    joinPointsWithin(convertedToPoints, 5);

    var offset = new Offset();
    offset.arcSegments(0);
    var convertedToOffset = offset.data(convertedToPoints).padding(4);

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
          return b.owner === a.owner;
        });
        var currentPolyLine = [];

        var halfEdgesDataForIsland = getBorderingHalfEdges(ownedIsland);

        var offsetted = convertHalfEdgeDataToOffset(halfEdgesDataForIsland);

        for (var jj = offsetted.length - 1; jj >= 0; jj--)
        {
          var point:
          {
            x: number;
            y: number;
            star: Star;
          } = <any> offsetted[jj];
          var nextPoint = jj === 0 ? offsetted[offsetted.length-1] : offsetted[jj - 1];

          var edgeCenter: Point =
          {
            x: (point.x + nextPoint.x) / 2,
            y: (point.y + nextPoint.y) / 2
          }
          var pointStar = point.star || voronoiInfo.getStarAtPoint(edgeCenter);
          point.star = pointStar;

          if (revealedStars.indexOf(point.star) === -1)
          {
            if (currentPolyLine.length > 0)
            {
              polyLines.push(currentPolyLine);
              currentPolyLine = [];
            }
          }
          else
          {
            // stupid hack to fix pixi bug with drawing polygons
            // without this consecutive edges with the same angle disappear
            point.x += (jj % 2) * 0.1;
            point.y += (jj % 2) * 0.1;

            currentPolyLine.push(point);
            processedStarsById[star.id] = true;
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