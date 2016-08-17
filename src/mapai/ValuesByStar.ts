import Star from "../Star";

export default class ValuesByStar<T>
{
  [starID: number]: T;

  constructor(stars: Star[], getInfluenceFN: (star: Star) => T)
  {
    stars.forEach(star =>
    {
      this[star.id] = getInfluenceFN(star);
    });
  }
}
