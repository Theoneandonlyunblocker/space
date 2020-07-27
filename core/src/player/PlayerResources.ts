import { activeModuleData } from "../app/activeModuleData";


// TODO 2019.09.28 | just move this and most other shit in core/**/* */ to core/src/*
export interface Resources
{
  [resourceType: string]: number;
}

export function getBaseValuablenessOfResources(resources: Resources): number
{
  return Object.keys(resources).reduce((totalValuableness, resourceType) =>
  {
    const amount = resources[resourceType];
    const resource = activeModuleData.templates.resources.get(resourceType);
    const valuableness = resource.baseValuableness * amount;

    return totalValuableness + valuableness;
  }, 0);
}

export function getMissingResources(availableResources: Resources, cost: Resources): Resources
{
  return Object.keys(cost).reduce((missingResources, resource) =>
  {
    const amountAvailable = availableResources[resource];
    const amountNeeded = cost[resource];
    if (amountAvailable < amountNeeded)
    {
      missingResources[resource] = amountNeeded - amountAvailable;
    }

    return missingResources;
  }, {});
}
