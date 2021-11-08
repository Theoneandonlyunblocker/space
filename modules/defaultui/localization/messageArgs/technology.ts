export type Technology =
{
  technologyLevel: [level: number];
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
