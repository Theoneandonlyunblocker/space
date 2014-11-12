/// <reference path="triangulation.ts" />

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    pointsToGenerate: number;
    points: number[][];
    triangles: Triangle[];

    constructor()
    {
      this.maxWidth = 800;
      this.maxHeight = 400;
    }

    generatePoints(amount: number = this.pointsToGenerate)
    {
      this.pointsToGenerate = amount;

      if (!amount) throw new Error();

      this.points = this.makePolarPoints(amount);
    }
    makeRandomPoints(amount: number)
    {
      var points: number[][] = [];

      for (var i = 0; i < amount; i++)
      {
        points.push(
        [
          Math.random() * this.maxWidth,
          Math.random() * this.maxHeight
        ]);
      }

      return points;
    }
    makePolarPoints(amount: number)
    {
      var points = [];
      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;

      for (var i = 0; i < amount; i++)
      {
        var distance = Math.random() * minBound;

        var angle = Math.random() * 2 * Math.PI;

        var x = Math.cos(angle) * distance + minBound2;
        var y = Math.sin(angle) * distance + minBound2;

        points.push([x, y]);
      }

      return points;
    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      this.triangles = triangulate(this.points);
    }
    drawMap()
    {
      function vectorToPoint(vector)
      {
        return new PIXI.Point(vector[0], vector[1])
      }

      var doc = new PIXI.DisplayObjectContainer();
      var gfx = new PIXI.Graphics();
      gfx.lineStyle(2, 0x000000, 1);

      doc.addChild(gfx);

      for (var i = 0; i < this.triangles.length; i++)
      {
        var triangle = this.triangles[i];
        var vertices = triangle.getPoints();

        for (var j = 0; j < vertices.length; j++)
        {
          var current = vertices[j];
          var next = vertices[(j + 1) % vertices.length];

          gfx.moveTo(current[0], current[1]);
          gfx.lineTo(next[0], next[1]);
        }
      }
      for (var i = 0; i < this.points.length; i++)
      {
        gfx.beginFill(0xFFFFFF);
        gfx.drawEllipse(this.points[i][0], this.points[i][1], 6, 6);
        gfx.endFill();
      }


      return doc;
    }
  }
}
