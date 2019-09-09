type OffsetPoint =
{
  x: number;
  y: number;
  data?: any;
}

declare namespace Offset
{

}

declare class Offset
{
  constructor(data?: any, vertices?: OffsetPoint[], arcSegments?: number);
  data(vertices: OffsetPoint[]): Offset;
  margin(amount: number): OffsetPoint[];
  padding(amount: number): OffsetPoint[];
  offset(amount: number): OffsetPoint[];
  arcSegments(amount: number): Offset;
}

declare module "polygon-offset"
{
  export = Offset;
}
