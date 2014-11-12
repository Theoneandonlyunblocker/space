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
        var points = [];


        for (var j = 0; j < vertices.length; j++)
        {
          points.push(vectorToPoint(vertices[j]));
        }

        points.push(vectorToPoint(vertices[0]));

        gfx.drawPolygon(points);
      }
      return doc;
    }
  }
}
