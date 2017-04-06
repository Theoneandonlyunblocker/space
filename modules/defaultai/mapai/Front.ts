import ArchetypeValues from "../../../src/ArchetypeValues";
import {Fleet} from "../../../src/Fleet";
import Unit from "../../../src/Unit";

import attachedUnitData from "../../common/attachedUnitData";

export class Front
{
  public id: number;
  public units: Unit[];

  constructor(id: number, units?: Unit[])
  {
    this.id = id;
    this.units = units || [];
  }
  public destroy(): void
  {
    this.units.forEach(unit =>
    {
      attachedUnitData.get(unit).front = null;
    });
  }
  public addUnit(unit: Unit): void
  {
    const unitData = attachedUnitData.get(unit);

    if (unitData.front)
    {
      unitData.front.removeUnit(unit);
    }

    unitData.front = this;

    this.units.push(unit);
  }
  public removeUnit(unit: Unit): void
  {
    attachedUnitData.get(unit).front = null;

    const unitIndex = this.getUnitIndex(unit);
    this.units.splice(unitIndex, 1);
  }
  public getUnitsByLocation(units: Unit[] = this.units): {[starId: number]: Unit[]}
  {
    const byLocation:
    {
      [starId: number]: Unit[];
    } = {};

    units.forEach(unit =>
    {
      const star = unit.fleet.location;
      if (!byLocation[star.id])
      {
        byLocation[star.id] = [];
      }

      byLocation[star.id].push(unit);
    });

    return byLocation;
  }
  public getFleetsByLocation(
    fleets: Fleet[] = this.getAssociatedFleets(),
  ): {[starId: number]: Fleet[]}
  {
    const byLocation:
    {
      [starId: number]: Fleet[];
    } = {};

    fleets.forEach(fleet =>
    {
      const star = fleet.location;
      if (!byLocation[star.id])
      {
        byLocation[star.id] = [];
      }

      byLocation[star.id].push(fleet);
    });

    return byLocation;
  }
  public getAssociatedFleets(): Fleet[]
  {
    const fleetsById:
    {
      [fleetId: number]: Fleet;
    } = {};

    for (let i = 0; i < this.units.length; i++)
    {
      if (!this.units[i].fleet)
      {
        continue;
      }

      if (!fleetsById[this.units[i].fleet.id])
      {
        fleetsById[this.units[i].fleet.id] = this.units[i].fleet;
      }
    }

    const allFleets: Fleet[] = [];

    for (let fleetId in fleetsById)
    {
      allFleets.push(fleetsById[fleetId]);
    }

    return allFleets;
  }
  public organizeAllFleets(): void
  {
    this.organizeFleets(
      this.getAssociatedFleets().filter(fleet => !fleet.isStealthy),
      this.units.filter(unit => !unit.isStealthy()),
    );

    this.organizeFleets(
      this.getAssociatedFleets().filter(fleet => fleet.isStealthy),
      this.units.filter(unit => unit.isStealthy()),
    );
  }
  public hasUnit(unit: Unit): boolean
  {
    return this.getUnitIndex(unit) !== -1;
  }
  public getUnitCountByArchetype(): ArchetypeValues
  {
    const unitCountByArchetype: ArchetypeValues = {};

    for (let i = 0; i < this.units.length; i++)
    {
      const archetype = this.units[i].template.archetype;

      if (!unitCountByArchetype[archetype.type])
      {
        unitCountByArchetype[archetype.type] = 0;
      }

      unitCountByArchetype[archetype.type]++;
    }

    return unitCountByArchetype;
  }

  private organizeFleets(fleetsToOrganize: Fleet[], unitsToOrganize: Unit[]): void
  {
    // pure fleet only has units belonging to this front in it

    const pureFleetsBeforeMerge = fleetsToOrganize.filter(fleet => this.isFleetPure(fleet));

    // merge pure fleets at same location
    this.mergeFleetsWithSharedLocation(pureFleetsBeforeMerge);
    const pureFleets = pureFleetsBeforeMerge.filter(fleet => fleet.units.length > 0);

    // move impure units to pure fleets at location if possible
    const unitsInImpureFleets = this.getUnitsInImpureFleets(unitsToOrganize);

    const pureFleetsByLocation = this.getFleetsByLocation(pureFleets);
    const impureUnitsByLocation = this.getUnitsByLocation(unitsInImpureFleets);

    for (let locationID in impureUnitsByLocation)
    {
      if (pureFleetsByLocation[locationID])
      {
        const fleet = pureFleetsByLocation[locationID][0];
        impureUnitsByLocation[locationID].forEach(unitToTransfer =>
        {
          const fleetToTransferFrom = unitToTransfer.fleet;
          fleetToTransferFrom.transferUnit(fleet, unitToTransfer);

          if (fleetToTransferFrom.units.length <= 0)
          {
            fleetToTransferFrom.deleteFleet();
          }
        });

        delete impureUnitsByLocation[locationID];
      }
    }

    // create new pure fleets from impure units
    for (let locationID in impureUnitsByLocation)
    {
      const units = impureUnitsByLocation[locationID];
      const player = units[0].fleet.player;
      const location = units[0].fleet.location;

      units.forEach(unitToRemove =>
      {
        unitToRemove.fleet.removeUnit(unitToRemove);
      });

      const fleet = new Fleet(units);
      player.addFleet(fleet);
      location.addFleet(fleet);
    }
  }
  private isFleetPure(fleet: Fleet): boolean
  {
    return fleet.units.every(unit => this.hasUnit(unit));
  }
  private getUnitIndex(unit: Unit): number
  {
    return this.units.indexOf(unit);
  }
  private mergeFleetsWithSharedLocation(fleetsToMerge: Fleet[]): void
  {
    const fleetsByLocationID = this.getFleetsByLocation(fleetsToMerge);

    for (let locationID in fleetsByLocationID)
    {
      const fleetsAtLocation = fleetsByLocationID[locationID].sort(Fleet.sortByImportance);

      // only goes down to i = 1
      for (let i = fleetsAtLocation.length - 1; i >= 1; i--)
      {
        fleetsAtLocation[i].mergeWith(fleetsAtLocation[0]);
      }
    }
  }
  private getUnitsInImpureFleets(units: Unit[]): Unit[]
  {
    const fleetPurityByID:
    {
      [fleetID: number]: boolean;
    } = {};

    return units.filter(unit =>
    {
      if (fleetPurityByID.hasOwnProperty("" + unit.fleet.id))
      {
        return !fleetPurityByID[unit.fleet.id];
      }
      else
      {
        const fleetIsPure = this.isFleetPure(unit.fleet);
        fleetPurityByID[unit.fleet.id] = fleetIsPure;

        return !fleetIsPure;
      }
    });
  }
}
