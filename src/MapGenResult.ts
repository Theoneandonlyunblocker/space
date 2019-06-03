// TODO global ref
// /// <reference path="../lib/quadtree.d.ts" />

import FillerPoint from "./FillerPoint";
import GalaxyMap from "./GalaxyMap";
import MapVoronoiInfo from "./MapVoronoiInfo";
import Player from "./Player";
import Star from "./Star";
import VoronoiCell from "./VoronoiCell";

import
{
  makeVoronoi,
  relaxVoronoi,
  setVoronoiCells,
} from "./voronoi";


export default class MapGenResult
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

  public makeMap(): GalaxyMap
  {
    this.voronoiInfo = this.makeVoronoiInfo();

    const map = new GalaxyMap(this);

    return map;
  }

  private getAllPoints(): (Star | FillerPoint)[]
  {
    const castedFillerPoints: (Star | FillerPoint)[] = this.fillerPoints;

    return castedFillerPoints.concat(this.stars);
  }
  private makeVoronoiInfo(): MapVoronoiInfo
  {
    const voronoiInfo = new MapVoronoiInfo();
    voronoiInfo.diagram = makeVoronoi(this.getAllPoints(), this.width, this.height);

    setVoronoiCells(voronoiInfo.diagram.cells);

    voronoiInfo.treeMap = this.makeVoronoiTreeMap();
    voronoiInfo.bounds =
    {
      x1: 0,
      x2: this.width,
      y1: 0,
      y2: this.height,
    };

    // move all stars to centroid of their voronoi cell. store original position for serialization
    for (let i = 0; i < this.stars.length; i++)
    {
      const star = this.stars[i];
      star.basisX = star.x;
      star.basisY = star.y;
    }

    relaxVoronoi(voronoiInfo.diagram, point =>
    {
      const isFiller = !isFinite((<Star>point).id);

      // dont move filler points
      return isFiller ? 0 : 1;
    });

    return voronoiInfo;
  }
  private makeVoronoiTreeMap(): BoundsQuadTree<VoronoiCell<Star>>
  {
    const treeMap = <BoundsQuadTree<VoronoiCell<Star>>> new QuadTree(
    {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });

    this.stars.forEach(star =>
    {
      treeMap.insert(star.voronoiCell);
    });

    return treeMap;
  }
}
