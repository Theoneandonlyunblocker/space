/// <reference path="star.ts" />

module Rance
{
  export class Region
  {
    id: string;
    stars: Star[];
    isFiller: boolean;

    constructor(id: string, stars: Star[], isFiller: boolean)
    {
      this.id = id;
      this.stars = stars;
      this.isFiller = isFiller;
    }
    addStar(star: Star)
    {
      this.stars.push(star);
      star.region = this;
    }
    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.isFiller = this.isFiller;

      return data;
    }
  }
}
