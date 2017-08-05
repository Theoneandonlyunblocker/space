export interface WeightedProbabilityDistribution<T>
{
  weight: number; // roulette selection with all other probabilities in group
  probabilityItems: ProbabilityItems<T>;
}

export interface FlatProbabilityDistribution<T>
{
  flatProbability: number; // if math.random < flatProbability: add
  probabilityItems: ProbabilityItems<T>;
}

export type NonTerminalProbabilityDistribution<T> = FlatProbabilityDistribution<T> | WeightedProbabilityDistribution<T>;
export type ProbabilityDistributions<T> = FlatProbabilityDistribution<T>[] | WeightedProbabilityDistribution<T>[];
export type ProbabilityItems<T> = T[] | ProbabilityDistributions<T>;
