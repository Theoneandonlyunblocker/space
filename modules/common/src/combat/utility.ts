import { Unit } from "core/src/unit/Unit";


// tslint:disable:no-any
export function makeFilteringUnitSelectFN<T extends (...args: any[]) => Unit[]>(baseFN: T, filterFN: (unit: Unit | null) => boolean): T;
export function makeFilteringUnitSelectFN(baseFN: ((...args: any[]) => Unit[]), filterFN: (unit: Unit | null) => boolean)
{
  return (...args: any[]) =>
  {
    return baseFN(...args).filter(filterFN);
  };
}
// tslint:enable:no-any

export function activeUnitsFilter(unit: Unit | null): unit is Unit
{
  return unit && unit.isActiveInBattle();
}
