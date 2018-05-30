import Point from "../../../src/Point";

import MapGenData from "./MapGenData";


export default class MapGenPoint implements Point
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
