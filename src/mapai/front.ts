/// <reference path="../unit.ts"/>
/// <reference path="../star.ts"/>

module Rance
{
  export class Front
  {
    id: number;
    objective: Objective;
    priority: number;
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
      priority: number;
      units?: Unit[];
      
      minUnitsDesired: number;
      idealUnitsDesired: number;

      targetLocation: Star;
      musterLocation: Star;
    })
    {
      this.id = props.id;
      this.objective = props.objective;
      this.priority = props.priority;
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
      get all ships in impure fleets + location
      merge pure fleets at same location
      move impure ships to pure fleets at location if possible
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

      var ownUnitFilterFN = function(unit)
      {
        return this.getUnitIndex(unit) >= 0;
      }.bind(this);

      // build indexes of pure fleets and impure ships
      for (var i = 0; i < allFleets.length; i++)
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
          var ownUnits = fleet.ships.filter(ownUnitFilterFN);

          for (var j = 0; j < ownUnits.length; j++)
          {
            if (!impureFleetMembersByLocation[star.id])
            {
              impureFleetMembersByLocation[star.id] = [];
            }

            impureFleetMembersByLocation[star.id].push(ownUnits[j]);
          }
        }
      }

      var sortFleetsBySizeFN = function(a, b)
      {
        return b.ships.length - a.ships.length;
      }

      for (var starId in pureFleetsByLocation)
      {
        // combine pure fleets at same location
        var fleets = pureFleetsByLocation[starId];
        if (fleets.length > 1)
        {
          fleets.sort(sortFleetsBySizeFN);

          // only goes down to i = 1 !!
          for (var i = fleets.length - 1; i >= 1; i--)
          {
            fleets[i].mergeWith(fleets[0]);
            fleets.splice(i, 1);
          }
        }

        // move impure ships to pure fleets at same location
        if (impureFleetMembersByLocation[starId])
        {
          for (var i = impureFleetMembersByLocation[starId].length - 1; i >= 0; i--)
          {
            var ship = impureFleetMembersByLocation[starId][i];
            ship.fleet.transferShip(fleets[0], ship);
            impureFleetMembersByLocation[starId].splice(i, 1);
          }
        }
      }

      // create new pure fleets from leftover impure ships
      for (var starId in impureFleetMembersByLocation)
      {
        var ships = impureFleetMembersByLocation[starId];
        if (ships.length < 1) continue;
        var newFleet = new Fleet(ships[0].fleet.player, [], ships[0].fleet.location);

        for (var i = ships.length - 1; i >= 0; i--)
        {
          ships[i].fleet.transferShip(newFleet, ships[i]);
        }
      }

    }
    isFleetPure(fleet: Fleet): boolean
    {
      for (var i = 0; i < fleet.ships.length; i++)
      {
        if (this.getUnitIndex(fleet.ships[i]) === -1)
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

      for (var i = 0; i < this.units.length; i++)
      {
        if (!fleetsById[this.units[i].fleet.id])
        {
          fleetsById[this.units[i].fleet.id] = this.units[i].fleet;
        }
      }

      var allFleets: Fleet[] = [];

      for (var fleetId in fleetsById)
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
      if (this.getUnitIndex(unit) === -1)
      {
        this.units.push(unit);
      }
    }
    removeUnit(unit: Unit)
    {
      var unitIndex = this.getUnitIndex(unit);
      if (unitIndex !== -1)
      {
        this.units.splice(unitIndex, 1);
      }
    }
    getUnitCountByArchetype()
    {
      var unitCountByArchetype:
      {
        [archetype: string]: number;
      } = {};

      for (var i = 0; i < this.units.length; i++)
      {
        var archetype = this.units[i].template.archetype;
        
        if (!unitCountByArchetype[archetype])
        {
          unitCountByArchetype[archetype] = 0;
        }

        unitCountByArchetype[archetype]++;
      }

      return unitCountByArchetype;
    }
    getUnitsByLocation()
    {
      var byLocation:
      {
        [starId: number]: Unit[];
      } = {};

      for (var i = 0; i < this.units.length; i++)
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

    moveFleets(afterMoveCallback: any)
    {
      var shouldMoveToTarget;

      var unitsByLocation = this.getUnitsByLocation();
      var fleets = this.getAssociatedFleets();

      var atMuster = unitsByLocation[this.musterLocation.id] ? 
        unitsByLocation[this.musterLocation.id].length : 0;
      var atTarget = unitsByLocation[this.targetLocation.id] ? 
        unitsByLocation[this.targetLocation.id].length : 0;

      if (this.hasMustered)
      {
        shouldMoveToTarget = true;
      }
      else
      {

        if (atMuster + atTarget >= this.minUnitsDesired)
        {
          this.hasMustered = true;
          shouldMoveToTarget = true;
        }
        else
        {
          shouldMoveToTarget = false;
        }

      }

      var moveTarget = shouldMoveToTarget ? this.targetLocation : this.musterLocation;

      for (var i = 0; i < fleets.length; i++)
      {
        fleets[i].move(moveTarget);
      }

      if (atTarget >= this.minUnitsDesired)
      {
        this.executeAction(afterMoveCallback);
        return
      }
      else
      {
        afterMoveCallback();
      }
    }
    executeAction(afterExecutedCallback)
    {
      var star = this.targetLocation;
      var player = this.units[0].fleet.player;

      if (this.objective.type === "expansion")
      {
        var attackTargets = star.getTargetsForPlayer(player);

        var target = attackTargets.filter(function(target)
        {
          return target.enemy.isIndependent;
        })[0];

        console.log("attack", star, target);
        player.attackTarget(star, target);
      }
      //afterExecutedCallback();
    }
  }
}
