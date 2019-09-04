export type Technology =
{
  technologyLevel: [number];
  technologyUnlocks: [{technologyName: string}];
  techUnlock_buildings: [];
  techUnlock_items: [];
  techUnlock_units: [];
  viewUnlocksForTech: [];
  technologyHasNoUnlocks: [];
  adjustTechnologyPriority: [];
  unlockTechnologyPriority: [];
  lockTechnologyPriority: [];
  cantAdjustTechnologyPriorityAsItsLocked: [];
};
