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
      this.maxWidth = 400;
      this.maxHeight = 400;
    }

    generatePoints(amount: number = this.pointsToGenerate)
    {
      this.pointsToGenerate = amount;

      if (!amount) throw new Error();

      this.points = this.makeRandomPoints(amount);
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
      return doc;
    }
  }
}
