import Objective from "./Objective";

import ArchetypeValues from "../../../src/ArchetypeValues";
import Fleet from "../../../src/Fleet";
import Star from "../../../src/Star";
import Unit from "../../../src/Unit";

import attachedUnitData from "../../common/attachedUnitData";

export class Front
{
  public id: number;
  public objective: Objective;
  public units: Unit[];

  public minUnitsDesired: number;
  public idealUnitsDesired: number;

  public targetLocation: Star;
  public musterLocation: Star;
  public hasMustered: boolean = false;

  constructor(props:
  {
    id: number;
    objective: Objective;
    units?: Unit[];

    minUnitsDesired: number;
    idealUnitsDesired: number;

    targetLocation: Star;
    musterLocation: Star;
  })
  {
    this.id = props.id;
    this.objective = props.objective;
    this.units = props.units || [];

    this.minUnitsDesired = props.minUnitsDesired;
    this.idealUnitsDesired = props.idealUnitsDesired;

    this.targetLocation = props.targetLocation;
    this.musterLocation = props.musterLocation;
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
  public getUnitsByLocation(): {[starId: number]: Unit[]}
  {
    const byLocation:
    {
      [starId: number]: Unit[];
    } = {};

    for (let i = 0; i < this.units.length; i++)
    {
      const star = this.units[i].fleet.location;
      if (!byLocation[star.id])
      {
        byLocation[star.id] = [];
      }

      byLocation[star.id].push(this.units[i]);
    }

    return byLocation;
  }
  public moveFleets(afterMoveCallback: () => void): void
  {
    if (this.units.length < 1)
    {
      afterMoveCallback();
      return;
    }
    else
    {
      const moveRoutine = this.objective.template.moveRoutineFN;
      moveRoutine(this, afterMoveCallback);
    }
  }
  public organizeFleets(): void
  {
    // pure fleet only has units belonging to this front in it
    /*
    get all pure fleets + location
    get all units in impure fleets + location
    merge pure fleets at same location
    move impure units to pure fleets at location if possible
    create new pure fleets with remaining impure units
     */
    const allFleets = this.getAssociatedFleets();

    const pureFleetsByLocation:
    {
      [starId: number]: Fleet[];
    } = {};
    const impureFleetMembersByLocation:
    {
      [starId: number]: Unit[];
    } = {};

    // build indexes of pure fleets and impure units
    for (let i = 0; i < allFleets.length; i++)
    {
      const fleet = allFleets[i];
      const star = fleet.location;

      if (this.isFleetPure(fleet))
      {
        if (!pureFleetsByLocation[star.id])
        {
          pureFleetsByLocation[star.id] = [];
        }

        pureFleetsByLocation[star.id].push(fleet);
      }
      else
      {
        const ownUnits = fleet.units.filter((unit) => this.hasUnit(unit));

        for (let j = 0; j < ownUnits.length; j++)
        {
          if (!impureFleetMembersByLocation[star.id])
          {
            impureFleetMembersByLocation[star.id] = [];
          }

          impureFleetMembersByLocation[star.id].push(ownUnits[j]);
        }
      }
    }

    const sortFleetsBySizeFN = (a: Fleet, b: Fleet) =>
    {
      return b.units.length - a.units.length;
    };

    for (let starId in pureFleetsByLocation)
    {
      // combine pure fleets at same location
      const fleets = pureFleetsByLocation[starId];
      if (fleets.length > 1)
      {
        fleets.sort(sortFleetsBySizeFN);

        // only goes down to i = 1 !!
        for (let i = fleets.length - 1; i >= 1; i--)
        {
          fleets[i].mergeWith(fleets[0]);
          fleets.splice(i, 1);
        }
      }

      // move impure units to pure fleets at same location
      if (impureFleetMembersByLocation[starId])
      {
        for (let i = impureFleetMembersByLocation[starId].length - 1; i >= 0; i--)
        {
          const unit = impureFleetMembersByLocation[starId][i];
          unit.fleet.transferUnit(fleets[0], unit);
          impureFleetMembersByLocation[starId].splice(i, 1);
        }
      }
    }

    // create new pure fleets from leftover impure units
    for (let starId in impureFleetMembersByLocation)
    {
      const units = impureFleetMembersByLocation[starId];
      if (units.length < 1)
      {
        continue;
      }
      const newFleet = new Fleet(units[0].fleet.player, [], units[0].fleet.location);

      for (let i = units.length - 1; i >= 0; i--)
      {
        units[i].fleet.transferUnit(newFleet, units[i]);
      }
    }

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
  public scoreUnitFit(unit: Unit): number
  {
    const template = this.objective.template;
    let score = 1;
    if (this.hasUnit(unit))
    {
      score += 0.2;
      if (this.hasMustered)
      {
        score += 0.3;
      }

      this.removeUnit(unit);
    }
    score *= this.objective.priority;
    score *= template.unitFitFN(unit, this);
    score *= template.unitDesireFN(this);
    return score;
  }
  public getNewUnitArchetypeScores(): ArchetypeValues
  {
    const countByArchetype = this.getUnitCountByArchetype();
    const totalUnits = this.units.length;
    const idealWeights = this.objective.template.preferredUnitComposition;
    const scores: ArchetypeValues = {};

    for (let unitType in idealWeights)
    {
      const archetypeCount = countByArchetype[unitType] || 0;
      scores[unitType] = totalUnits * idealWeights[unitType] - archetypeCount;
    }

    return scores;
  }
  private isFleetPure(fleet: Fleet): boolean
  {
    return fleet.units.every((unit) => this.hasUnit(unit));
  }
  private getUnitIndex(unit: Unit): number
  {
    return this.units.indexOf(unit);
  }
  private hasUnit(unit: Unit): boolean
  {
    return this.getUnitIndex(unit) !== -1;
  }

  private getUnitCountByArchetype(): ArchetypeValues
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
}
