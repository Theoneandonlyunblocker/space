import {Point} from "src/math/Point";

import {MapGenData} from "./MapGenData";


export class MapGenPoint implements Point
{
  public x: number;
  public y: number;

  public mapGenData: MapGenData = {};

  constructor(x: number, y: number)
  {
    this.x = x;
    this.y = y;
  }
}
