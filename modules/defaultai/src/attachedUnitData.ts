// Used for storing unit properties not needed by core game

import {Unit} from "core/src/unit/Unit";
import {ValuesByUnit} from "core/src/unit/ValuesByUnit";
import
{
  shallowExtend,
} from "core/src/generic/utility";

import {Front} from "./mapai/Front";
import { PartialTriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScripts";


interface AttachedUnitData
{
  front?: Front;
}

class AttachedUnitDataManager
{
  private byUnit: ValuesByUnit<AttachedUnitData>;

  constructor()
  {
    this.byUnit = new ValuesByUnit<AttachedUnitData>();
  }

  public get(unit: Unit): AttachedUnitData
  {
    if (!this.byUnit.has(unit))
    {
      this.byUnit.set(unit, {});
    }

    return this.byUnit.get(unit)!;
  }
  public set(unit: Unit, data: AttachedUnitData): void
  {
    if (this.byUnit.has(unit))
    {
      const oldData = this.byUnit.get(unit)!;
      const mergedData = shallowExtend(oldData, data);
      this.byUnit.set(unit, mergedData);
    }
    else
    {
      this.byUnit.set(unit, data);
    }
  }
  public delete(unit: Unit): void
  {
    this.byUnit.delete(unit);
  }
  public deleteAll(): void
  {
    this.byUnit = new ValuesByUnit<AttachedUnitData>();
  }
}

export const attachedUnitData = new AttachedUnitDataManager();

export const attachedUnitDataScripts: PartialTriggeredScriptsWithData =
{
  unit:
  {
    removeFromPlayer:
    {
      removeFromFront:
      {
        triggerPriority: 0,
        script: (unit: Unit) =>
        {
          const front = attachedUnitData.get(unit).front;
          if (front)
          {
            front.removeUnit(unit);
          }

          attachedUnitData.delete(unit);
        },
      },
    },
  },
};
