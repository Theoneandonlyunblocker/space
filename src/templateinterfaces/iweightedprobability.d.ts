declare namespace Rance
{
  namespace Templates
  {
    interface IWeightedProbability<T>
    {
      // only flatProbability or weight should be specified. units in same group must all have same prop specified
      flatProbability?: number; // if math.random < flatProbability: add
      weight?: number; // added together with all other probabilities in group, 1 is picked (roulette selection)
      probabilityItems: T[] | IWeightedProbability<T>[];
    }
  }
}
