module Rance
{
  export class Triangle
  {
    edges: number[][][];

    circumCenterX: number;
    circumCenterY: number;
    circumRadius: number;

    constructor(
      public a: number[],
      public b: number[],
      public c: number[]
    )
    {
      
    }

    getPoints()
    {
      return [this.a, this.b, this.c];
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

      if (Math.abs(pB[1] - pA[1]) < tolerance)
      {
        m2 = -(pC[0] - pB[0]) / (pC[1] - pB[1]);
        mx2 = (pB[0] + pC[0]) * 0.5;
        my2 = (pB[1] + pC[1]) * 0.5;

        cX = (pB[0] + pA[0]) * 0.5;
        cY = m2 * (cX - mx2) + my2;
      }
      else
      {
        m1 = -(pB[0] - pA[0]) / (pB[1] - pA[1]);
        mx1 = (pA[0] + pB[0]) * 0.5;
        my1 = (pA[1] + pB[1]) * 0.5;

        if (Math.abs(pC[1] - pB[1]) < tolerance)
        {
          cX = (pC[0] + pB[0]) * 0.5;
          cY = m1 * (cX - mx1) + my1;
        }
        else
        {
          m2 = -(pC[0] - pB[0]) / (pC[1] - pB[1]);
          mx2 = (pB[0] + pC[0]) * 0.5;
          my2 = (pB[1] + pC[1]) * 0.5;

          cX = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
          cY = m1 * (cX - mx1) + my1;
        }
      }

      this.circumCenterX = cX;
      this.circumCenterY = cY;



      mx1 = pB[0] - cX;
      my1 = pB[1] - cY;
      this.circumRadius = Math.sqrt(mx1 * mx1 + my1 * my1);
    }
    circumCircleContainsPoint(point: number[])
    {
      this.calculateCircumCircle();
      var x = point[0] - this.circumCenterX;
      var y = point[1] - this.circumCenterY;

      var contains = x * x + y * y <= this.circumRadius * this.circumRadius;

      return(contains);
    }
    getEdges()
    {
      if (!this.edges)
      {
        this.edges =
        [
          [this.a, this.b],
          [this.b, this.c],
          [this.c, this.a]
        ];
      }

      return this.edges;
    }
    sharesVertexesWith(toCheckAgainst: Triangle)
    {
      var ownPoints = this.getPoints();
      var otherPoints = toCheckAgainst.getPoints();

      for (var i = 0; i < ownPoints.length; i++)
      {
        if (otherPoints.indexOf(ownPoints[i]) >= 0)
        {
          return true;
        }
      }

      return false;
    }
  }
}
