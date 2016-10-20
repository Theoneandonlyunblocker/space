import {DistributionData} from "./DistributionData";

import
{
  getRandomArrayItem,
} from "../utility";

export interface Distributable
{
  type: string;
  distributionData: DistributionData;
}

export function getRandomWeightedDistributable<T extends Distributable>(
  candidates: T[]
): T
{
  const maxWeight = candidates.map((distributable) =>
  {
    return distributable.distributionData.weight;
  }).reduce((total, current) =>
  {
    return Math.max(total, current);
  }, -Infinity);

  if (maxWeight <= 0)
  {
    const candidatesWithMaxWeight = candidates.filter((distributable) =>
    {
      return distributable.distributionData.weight === maxWeight;
    });

    return getRandomArrayItem(candidatesWithMaxWeight);
  }
  else
  {
    while (true)
    {
      const candidate = getRandomArrayItem(candidates);
      if (Math.random() < candidate.distributionData.weight / maxWeight)
      {
        return candidate;
      }
    }
  }
}

export function getDistributablesMatchingHighestPriorityGroup<T extends Distributable>(
  candidates: T[],
  groupsByPriority: string[],
): T[]
{
  if (groupsByPriority.length === 0)
  {
    return candidates;
  }

  const distributablesThatDidntMatchGroups: T[] = [];

  for (let i = 0; i < groupsByPriority.length; i++)
  {
    const group = groupsByPriority[i];
    const distributablesWithGroup = candidates.filter((distributable) =>
    {
      const distributableHasGroup = distributable.distributionData.distributionGroups.indexOf(group) !== -1;

      if (i === groupsByPriority.length - 1 && !distributableHasGroup)
      {
        distributablesThatDidntMatchGroups.push(distributable);
      }

      return distributableHasGroup;
    });

    if (distributablesWithGroup.length > 0)
    {
      return distributablesWithGroup;
    }
  }

  return distributablesThatDidntMatchGroups;
}


export function filterCandidatesByGroups<T extends Distributable>(
  candidates: T[],
  groupsToMatch: string[],
  valueWhenGroupMatches: boolean,
): T[]
{
  return candidates.filter((candidate) =>
  {
    const hasGroupMatch = candidate.distributionData.distributionGroups.some((candidateGroup) =>
    {
      return groupsToMatch.indexOf(candidateGroup) !== -1;
    });

    if (valueWhenGroupMatches === true)
    {
      return hasGroupMatch;
    }
    else
    {
      return !hasGroupMatch;
    }
  });
}

export function getDistributablesWithGroups<T extends Distributable>(
  candidates: T[],
  groupsToFilter: string[],
): T[]
{
  return filterCandidatesByGroups(
    candidates,
    groupsToFilter,
    true,
  );
}

export function getDistributablesWithoutGroups<T extends Distributable>(
  candidates: T[],
  groupsToFilter: string[],
): T[]
{
  return filterCandidatesByGroups(
    candidates,
    groupsToFilter,
    false,
  );
}
