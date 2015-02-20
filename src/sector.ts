module Rance
{
  export class Sector
  {
    id: number;
    stars: Star[] = [];

    constructor(id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.sector++;
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
  }
}
