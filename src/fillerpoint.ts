import Point from "./Point.ts";

export default class FillerPoint implements Point
{
  x: number;
  y: number;

  mapGenData: any = {};
  voronoiCell: any;
  voronoiId: number;

  constructor(x: number, y: number)
  {
    this.x = x;
    this.y = y;
  }
  setPosition(x: number, y: number): void
  {
    this.x = x;
    this.y = y;
  }
  serialize(): Point
  {
    return(
    {
      x: this.x,
      y: this.y
    });
  }
}
