interface Point
{
  x: number;
  y: number;
}
interface Rect
{
  x: number;
  y: number;
  width: number;
  height: number;
}

declare class QuadTree<T>
{
  constructor(bounds: Rect, isPointTree?: boolean, maxDepth?: number, maxChildren?: number);
  
  insert(toInsert: T): void;
  retrieve<P extends Point>(retrievePoint: P): T[];
  retrieve<R extends Rect>(retrieveBounds: R): T[];
}

declare class PointQuadTree<T extends Point> extends QuadTree<T>
{
  
}

declare class BoundsQuadTree<T extends Rect> extends QuadTree<T>
{
  
}
