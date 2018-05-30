import GalaxyMapSaveData from "./savedata/GalaxyMapSaveData";

import FillerPoint from "./FillerPoint";
import MapGenResult from "./MapGenResult";
import MapVoronoiInfo from "./MapVoronoiInfo";
import Player from "./Player";
import Star from "./Star";


export default class GalaxyMap
{
  stars: Star[];
  fillerPoints: FillerPoint[];
  width: number;
  height: number;
  seed: string;

  independents: Player[];
  voronoi: MapVoronoiInfo;

  constructor(mapGen: MapGenResult)
  {
    this.width = mapGen.width;
    this.height = mapGen.height;

    this.seed = mapGen.seed;

    this.stars = mapGen.stars;
    this.fillerPoints = mapGen.fillerPoints;

    this.independents = mapGen.independents;
    this.voronoi = mapGen.voronoiInfo;
  }
  getIncomeBounds()
  {
    let min: number;
    let max: number;

    for (let i = 0; i < this.stars.length; i++)
    {
      const star = this.stars[i];
      const income = star.getIncome();
      if (!min) { min = max = income; }
      else
      {
        if (income < min) { min = income; }
        else if (income > max) { max = income; }
      }
    }

    return(
    {
      min: min,
      max: max,
    });
  }
  serialize(): GalaxyMapSaveData
  {
    const data: GalaxyMapSaveData =
    {
      stars: this.stars.map(star => star.serialize()),

      fillerPoints: this.fillerPoints.map(fillerPoint => fillerPoint.serialize()),

      width: this.width,
      height: this.height,
      seed: this.seed,
    };


    return data;
  }
}
