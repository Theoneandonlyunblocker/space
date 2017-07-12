// Used for storing unit properties not needed by core game

import Unit from "../../src/Unit";
import ValuesByUnit from "../../src/ValuesByUnit";
import
{
  shallowExtend,
} from "../../src/utility";

import PartialAllScripts from "../../src/modulescriptinterfaces/PartialAllScripts";

import {Front} from "../defaultai/mapai/Front";

interface PartialAttachedUnitData
{
  front?: Front;
}

class AttachedUnitData
{
  private byUnit: ValuesByUnit<PartialAttachedUnitData>;

  constructor()
  {
    this.byUnit = new ValuesByUnit<PartialAttachedUnitData>();
  }

  public get(unit: Unit): PartialAttachedUnitData
  {
    if (!this.byUnit.has(unit))
    {
      this.byUnit.set(unit, {});
    }

    return this.byUnit.get(unit);
  }
  public set(unit: Unit, data: PartialAttachedUnitData): void
  {
    if (this.byUnit.has(unit))
    {
      const oldData = this.byUnit.get(unit);
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
    this.byUnit = new ValuesByUnit<PartialAttachedUnitData>();
  }
}

const attachedUnitData = new AttachedUnitData();

export default attachedUnitData;

export const attachedUnitDataScripts: PartialAllScripts =
{
  unit:
  {
    removeFromPlayer:
    [
      unit =>
      {
        const front = attachedUnitData.get(unit).front;
        if (front)
        {
          front.removeUnit(unit);
        }

        attachedUnitData.delete(unit);
      },
    ],
  },
};
