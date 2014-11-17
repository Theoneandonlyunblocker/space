/// <reference path="player.ts" />
/// <reference path="unit.ts" />
/// <reference path="star.ts" />

module Rance
{
  export class Fleet
  {
    player: Player;
    ships: Unit[];
    location: Star;

    name: string;

    constructor(player: Player, ships: Unit[], location: Star)
    {
      this.player = player;
      this.ships = ships;
      this.location = location;

      this.location.addFleet(this);
      this.player.addFleet(this);
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
    split(newShips: Unit[])
    {
      this.removeShips(newShips);

      var newFleet = new Fleet(this.player, newShips, this.location);
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