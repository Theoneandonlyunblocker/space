import Objective from "./Objective";

import ArchetypeValues from "../../../src/ArchetypeValues";
import Unit from "../../../src/Unit";
import Star from "../../../src/Star";
import Fleet from "../../../src/Fleet";
import attachedUnitData from "../../common/attachedUnitData";

export default class Front
{
  id: number;
  objective: Objective;
  units: Unit[];

  minUnitsDesired: number;
  idealUnitsDesired: number;

  targetLocation: Star;
  musterLocation: Star;
  hasMustered: boolean = false;

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

  organizeFleets()
  {
    // pure fleet only has units belonging to this front in it
    /*
    get all pure fleets + location
    get all units in impure fleets + location
    merge pure fleets at same location
    move impure units to pure fleets at location if possible
    create new pure fleets with remaining impure units
     */
    var allFleets = this.getAssociatedFleets();

    var pureFleetsByLocation:
    {
      [starId: number]: Fleet[];
    } = {};
    var impureFleetMembersByLocation:
    {
      [starId: number]: Unit[];
    } = {};

    var ownUnitFilterFN = function(unit: Unit)
    {
      return this.getUnitIndex(unit) >= 0;
    }.bind(this);

    // build indexes of pure fleets and impure units
    for (let i = 0; i < allFleets.length; i++)
    {
      var fleet = allFleets[i];
      var star = fleet.location;

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
        var ownUnits = fleet.units.filter(ownUnitFilterFN);

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

    var sortFleetsBySizeFN = function(a: Fleet, b: Fleet)
    {
      return b.units.length - a.units.length;
    }

    for (let starId in pureFleetsByLocation)
    {
      // combine pure fleets at same location
      var fleets = pureFleetsByLocation[starId];
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
          var unit = impureFleetMembersByLocation[starId][i];
          unit.fleet.transferUnit(fleets[0], unit);
          impureFleetMembersByLocation[starId].splice(i, 1);
        }
      }
    }

    // create new pure fleets from leftover impure units
    for (let starId in impureFleetMembersByLocation)
    {
      var units = impureFleetMembersByLocation[starId];
      if (units.length < 1) continue;
      var newFleet = new Fleet(units[0].fleet.player, [], units[0].fleet.location);

      for (let i = units.length - 1; i >= 0; i--)
      {
        units[i].fleet.transferUnit(newFleet, units[i]);
      }
    }

  }
  isFleetPure(fleet: Fleet): boolean
  {
    for (let i = 0; i < fleet.units.length; i++)
    {
      if (this.getUnitIndex(fleet.units[i]) === -1)
      {
        return false;
      }
    }

    return true;
  }
  getAssociatedFleets(): Fleet[]
  {
    var fleetsById:
    {
      [fleetId: number]: Fleet;
    } = {};

    for (let i = 0; i < this.units.length; i++)
    {
      if (!this.units[i].fleet) continue;
      
      if (!fleetsById[this.units[i].fleet.id])
      {
        fleetsById[this.units[i].fleet.id] = this.units[i].fleet;
      }
    }

    var allFleets: Fleet[] = [];

    for (let fleetId in fleetsById)
    {
      allFleets.push(fleetsById[fleetId]);
    }

    return allFleets;
  }
  getUnitIndex(unit: Unit)
  {
    return this.units.indexOf(unit);
  }
  addUnit(unit: Unit)
  {
    const unitData = attachedUnitData.get(unit);
    if (unitData)
    {
      if (unitData.front)
      {
        unitData.front.removeUnit(unit);
      }
      
      unitData.front = this;
    }
    this.units.push(unit);
  }
  removeUnit(unit: Unit)
  {
    var unitIndex = this.getUnitIndex(unit);
    attachedUnitData.get(unit).front = null;
    this.units.splice(unitIndex, 1);
  }
  getUnitCountByArchetype()
  {
    var unitCountByArchetype: ArchetypeValues = {};

    for (let i = 0; i < this.units.length; i++)
    {
      var archetype = this.units[i].template.archetype;
      
      if (!unitCountByArchetype[archetype.type])
      {
        unitCountByArchetype[archetype.type] = 0;
      }

      unitCountByArchetype[archetype.type]++;
    }

    return unitCountByArchetype;
  }
  getUnitsByLocation()
  {
    var byLocation:
    {
      [starId: number]: Unit[];
    } = {};

    for (let i = 0; i < this.units.length; i++)
    {
      var star = this.units[i].fleet.location;
      if (!byLocation[star.id])
      {
        byLocation[star.id] = [];
      }

      byLocation[star.id].push(this.units[i]);
    }

    return byLocation;
  }
  moveFleets(afterMoveCallback: () => void)
  {
    if (this.units.length < 1)
    {
      afterMoveCallback();
      return;
    }
    else
    {
      var moveRoutine = this.objective.template.moveRoutineFN;
      moveRoutine(this, afterMoveCallback);
    }
  }
  hasUnit(unit: Unit)
  {
    return this.units.indexOf(unit) !== -1;
  }
  scoreUnitFit(unit: Unit)
  {
    var template = this.objective.template;
    var score = 1;
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
  getNewUnitArchetypeScores()
  {
    var countByArchetype = this.getUnitCountByArchetype();
    var totalUnits = this.units.length;
    var idealWeights = this.objective.template.preferredUnitComposition;
    var scores: ArchetypeValues = {};

    for (let unitType in idealWeights)
    {
      var archetypeCount = countByArchetype[unitType] || 0;
      scores[unitType] = totalUnits * idealWeights[unitType] - archetypeCount;
    }

    return scores;
  }
}
