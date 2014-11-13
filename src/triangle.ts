module Rance
{
  export interface Point
  {
    x: number;
    y: number;
  }
  export class Triangle
  {
    circumCenterX: number;
    circumCenterY: number;
    circumRadius: number;

    constructor(
      public a: Point,
      public b: Point,
      public c: Point
    )
    {
      
    }

    getPoints()
    {
      return [this.a, this.b, this.c];
    }
    getCircumCenter()
    {
      if (!this.circumRadius)
      {
        this.calculateCircumCircle();
      }
      
      return [this.circumCenterX, this.circumCenterY];
    }
    calculateCircumCircle(tolerance: number = 0.00001)
    {
      var pA = this.a;
      var pB = this.b;
      var pC = this.c;

      var m1, m2;
      var mx1, mx2;
      var my1, my2;
      var cX, cY;

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
    circumCircleContainsPoint(point: Point)
    {
      this.calculateCircumCircle();
      var x = point.x - this.circumCenterX;
      var y = point.y - this.circumCenterY;

      var contains = x * x + y * y <= this.circumRadius * this.circumRadius;

      return(contains);
    }
    getEdges()
    {
      var edges =
      [
        [this.a, this.b],
        [this.b, this.c],
        [this.c, this.a]
      ];

      return edges;
    }
    getAmountOfSharedVerticesWith(toCheckAgainst: Triangle)
    {
      var ownPoints = this.getPoints();
      var otherPoints = toCheckAgainst.getPoints();
      var shared = 0;

      for (var i = 0; i < ownPoints.length; i++)
      {
        if (otherPoints.indexOf(ownPoints[i]) >= 0)
        {
          shared++;
        }
      }

      return shared;
    }
  }
}
