/// <reference path="../../lib/quadtree.d.ts" />

/// <reference path="../mapvoronoiinfo.ts" />
/// <reference path="../galaxymap.ts" />
/// <reference path="../star.ts" />
/// <reference path="../fillerpoint.ts" />
/// <reference path="../player.ts" />

/// <reference path="voronoi.ts" />

export namespace MapGenCore
{
  export class MapGenResult
  {
    stars: Star[];
    fillerPoints: FillerPoint[];
    width: number;
    height: number;
    seed: string;

    independents: Player[];
    voronoiInfo: MapVoronoiInfo;

    constructor(props:
    {
      stars: Star[];
      fillerPoints: FillerPoint[];

      width: number;
      height: number;
      seed: string;

      independents: Player[];
    })
    {
      this.stars = props.stars;
      this.fillerPoints = props.fillerPoints;

      this.width = props.width;
      this.height = props.height;
      this.seed = props.seed;

      this.independents = props.independents;
    }

    getAllPoints(): Point[]
    {
      return this.fillerPoints.concat(this.stars);
    }

    makeMap(): GalaxyMap
    {
      this.voronoiInfo = this.makeVoronoiInfo();

      this.clearMapGenData()

      var map = new GalaxyMap(this);

      return map;
    }

    makeVoronoiInfo(): MapVoronoiInfo
    {
      var voronoiInfo = new MapVoronoiInfo();
      voronoiInfo.diagram = MapGenCore.makeVoronoi(this.getAllPoints(), this.width, this.height);
      voronoiInfo.treeMap = this.makeVoronoiTreeMap();
      voronoiInfo.bounds =
      {
        x1: 0,
        x2: this.width,
        y1: 0,
        y2: this.height
      };

      // move all stars to centroid of their voronoi cell. store original position for serialization
      for (var i = 0; i < this.stars.length; i++)
      {
        var star = this.stars[i];
        star.basisX = star.x;
        star.basisY = star.y;
      }

      MapGenCore.relaxVoronoi(voronoiInfo.diagram, function(point)
      {
        // dont move filler points
        return isFinite(point.id) ? 1 : 0;
      });

      return voronoiInfo;
    }

    makeVoronoiTreeMap()
    {
      var treeMap = new QuadTree(
      {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
      });

      for (var i = 0; i < this.stars.length; i++)
      {
        var cell = this.stars[i].voronoiCell;
        var bbox = cell.getBbox();
        bbox.cell = cell;
        treeMap.insert(bbox);
      }

      return treeMap;
    }

    clearMapGenData()
    {
      if (Options.debugMode)
      {
        console.log("Skipped cleaning map gen data due to debug mode being enabled");
        return;
      }
      for (var i = 0; i < this.stars.length; i++)
      {
        this.stars[i].mapGenData = null;
        delete this.stars[i].mapGenData;
        delete this.stars[i].voronoiId;
      }
    }
  }
}
