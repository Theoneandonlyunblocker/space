/// <reference path="player.ts" />
/// <reference path="unit.ts" />
/// <reference path="star.ts" />

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.fleets = idGenerators.fleets || 0;

  export class Fleet
  {
    player: Player;
    ships: Unit[] = [];
    location: Star;

    id: number;
    name: string;

    constructor(player: Player, ships: Unit[], location: Star, id?: number)
    {
      this.player = player;
      this.location = location;
      this.id = isFinite(id) ? id : idGenerators.fleets++;
      this.name = "Fleet " + this.id;

      this.location.addFleet(this);
      this.player.addFleet(this);

      this.addShips(ships);

      eventManager.dispatchEvent("renderMap", null);
    }
    getShipIndex(ship: Unit)
    {
      return this.ships.indexOf(ship);
    }
    hasShip(ship: Unit)
    {
      return this.getShipIndex(ship) >= 0;
    }
    deleteFleet()
    {
      this.location.removeFleet(this);
      this.player.removeFleet(this);

      eventManager.dispatchEvent("renderMap", null);
    }
    mergeWith(fleet: Fleet)
    {
      fleet.addShips(this.ships);
      this.deleteFleet();
    }
    addShip(ship: Unit)
    {
      if (this.hasShip(ship)) return false;

      this.ships.push(ship);
      ship.addToFleet(this);
    }
    addShips(ships: Unit[])
    {
      for (var i = 0; i < ships.length; i++)
      {
        this.addShip(ships[i]);
      }
    }
    removeShip(ship: Unit)
    {
      var index = this.getShipIndex(ship);

      if (index < 0) return false;

      this.ships.splice(index, 1);
      ship.removeFromFleet();

      if (this.ships.length <= 0)
      {
        this.deleteFleet();
      }
    }
    removeShips(ships: Unit[])
    {
      for (var i = 0; i < ships.length; i++)
      {
        this.removeShip(ships[i]);
      }
    }
    transferShip(fleet: Fleet, ship: Unit)
    {
      if (fleet === this) return;
      var index = this.getShipIndex(ship);

      if (index < 0) return false;

      fleet.addShip(ship);

      this.ships.splice(index, 1);
    }
    split()
    {
      var newFleet = new Fleet(this.player, [], this.location);
      this.location.addFleet(newFleet);


      return newFleet;
    }
    move(newLocation: Star)
    {
      var oldLocation = this.location;
      oldLocation.removeFleet(this);

      this.location = newLocation;
      newLocation.addFleet(this);
    }
    getFriendlyFleetsAtOwnLocation()
    {
      return this.location.fleets[this.player.id];
    }
    getTotalStrength()
    {
      var total =
      {
        current: 0,
        max: 0
      }

      for (var i = 0; i < this.ships.length; i++)
      {
        total.current += this.ships[i].currentStrength;
        total.max += this.ships[i].maxStrength;
      }

      return total;
    }
  }
}