import VoronoiCell from "./VoronoiCell";

import Point from "./Point";

export default class FillerPoint implements Point
{
  x: number;
  y: number;

  voronoiCell: VoronoiCell<FillerPoint>;

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
      y: this.y,
    });
  }
}
