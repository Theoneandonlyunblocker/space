interface Point
{
  x: number;
  y: number;
  data?: any;
}

declare class Offset
{
  constructor(data?: any, vertices?: Point[], arcSegments?: number);
  data(vertices: Point[]): Offset;
  margin(amount: number): Point[];
  padding(amount: number): Point[];
  offset(amount: number): Point[];
  arcSegments(amount: number): Offset;
}