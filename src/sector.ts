/// <reference path="star.ts" />
/// <reference path="color.ts" />

module Rance
{
  export class Sector
  {
    id: number;
    stars: Star[] = [];
    color: number;

    constructor(id?: number, color?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.sector++;
      
      this.color = isFinite(color) ? color : hslToHex.apply(null, 
        [randRange(0, 1), randRange(0.8, 1), randRange(0.4, 0.6)]);
    }
    addStar(star: Star)
    {
      if (star.sector)
      {
        throw new Error("Star already part of a sector");
      }

      this.stars.push(star);
      star.sector = this;
    }

    getNeighboringStars()
    {
      var neighbors: Star[] = [];
      var alreadyAdded:
      {
        [starId: number]: boolean;
      } = {};

      for (var i = 0; i < this.stars.length; i++)
      {
        var frontier = this.stars[i].getLinkedInRange(1).all;
        for (var j = 0; j < frontier.length; j++)
        {
          if (frontier[j].sector !== this && !alreadyAdded[frontier[j].id])
          {
            neighbors.push(frontier[j]);
            alreadyAdded[frontier[j].id] = true;
          }
        }
      }

      return neighbors;
    }

    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.starIds = this.stars.map(function(star)
      {
        return star.id;
      });
      data.color = this.color;

      return data;
    }
  }
}
