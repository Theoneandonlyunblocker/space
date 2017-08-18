import Point from "../../../src/Point";

export default class Triangle<T extends Point>
{
  public a: T;
  public b: T;
  public c: T;

  private circumCenterX: number;
  private circumCenterY: number;
  private circumRadius: number;

  constructor(a: T, b: T, c: T)
  {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  private getPoints()
  {
    return [this.a, this.b, this.c];
  }
  private calculateCircumCircle(tolerance: number = 0.00001)
  {
    const pA = this.a;
    const pB = this.b;
    const pC = this.c;

    let m1: number, m2: number;
    let mx1: number, mx2: number;
    let my1: number, my2: number;
    let cX: number, cY: number;

    if (Math.abs(pB.y - pA.y) < tolerance)
    {
      m2 = -(pC.x - pB.x) / (pC.y - pB.y);
      mx2 = (pB.x + pC.x) * 0.5;
      my2 = (pB.y + pC.y) * 0.5;

      cX = (pB.x + pA.x) * 0.5;
      cY = m2 * (cX - mx2) + my2;
    }
    else
    {
      m1 = -(pB.x - pA.x) / (pB.y - pA.y);
      mx1 = (pA.x + pB.x) * 0.5;
      my1 = (pA.y + pB.y) * 0.5;

      if (Math.abs(pC.y - pB.y) < tolerance)
      {
        cX = (pC.x + pB.x) * 0.5;
        cY = m1 * (cX - mx1) + my1;
      }
      else
      {
        m2 = -(pC.x - pB.x) / (pC.y - pB.y);
        mx2 = (pB.x + pC.x) * 0.5;
        my2 = (pB.y + pC.y) * 0.5;

        cX = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
        cY = m1 * (cX - mx1) + my1;
      }
    }

    this.circumCenterX = cX;
    this.circumCenterY = cY;



    mx1 = pB.x - cX;
    my1 = pB.y - cY;
    this.circumRadius = Math.sqrt(mx1 * mx1 + my1 * my1);
  }
  public circumCircleContainsPoint(point: Point)
  {
    this.calculateCircumCircle();
    const x = point.x - this.circumCenterX;
    const y = point.y - this.circumCenterY;

    const contains = x * x + y * y <= this.circumRadius * this.circumRadius;

    return(contains);
  }
  public getEdges()
  {
    const edges =
    [
      [this.a, this.b],
      [this.b, this.c],
      [this.c, this.a],
    ];

    return edges;
  }
  public getAmountOfSharedVerticesWith(toCheckAgainst: Triangle<Point>)
  {
    const ownPoints = this.getPoints();
    const otherPoints = toCheckAgainst.getPoints();
    let shared = 0;

    for (let i = 0; i < ownPoints.length; i++)
    {
      if (otherPoints.indexOf(ownPoints[i]) >= 0)
      {
        shared++;
      }
    }

    return shared;
  }
  public getArea(): number
  {
    return Math.abs(this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y)) / 2;
  }
  public getRandomPoint(): Point
  {
    const r1 = Math.random();
    const r2 = Math.random();

    const v1 = [r1 * (this.b.x - this.a.x), r1 * (this.b.y - this.a.y)];
    const v2 = [r2 * (this.c.x - this.a.x), r2 * (this.c.y - this.a.y)];

    const x = v1[0] + v2[0];
    const y = v1[1] + v2[1];

    if (r1 + r2 > 1)
    {
      return this.getRandomPoint();
    }
    else
    {
      return(
      {
        x: x + this.a.x,
        y: y + this.a.y,
      });
    }
  }
}
