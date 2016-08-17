import Star from "../Star";

export default class ValuesByStar<T>
{
  [asd: number]: boolean;
  public byStar:
  {
    [starID: number]: T;
  } = {};

  constructor(stars: Star[], getInfluenceFN: (star: Star) => T)
  {
    stars.forEach(star =>
    {
      this.byStar[star.id] = getInfluenceFN(star);
    });
  }
}
