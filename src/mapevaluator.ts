/// <reference path="galaxymap.ts"/>
/// <reference path="player.ts"/>

module Rance
{
  export class MapEvaluator
  {
    map: GalaxyMap;
    player: Player;

    constructor(map: GalaxyMap, player: Player)
    {
      this.map = map;
      this.player = player;
    }

    getHostileStrengthAtStar(star: Star)
    {
      var hostilePlayers = star.getEnemyFleetOwners(this.player);
      var strengthByEnemy:
      {
        [playerId: number]: number;
      } = {};

      for (var i = 0; i < hostilePlayers.length; i++)
      {
        var enemyShips = star.getAllShipsOfPlayer(hostilePlayers[i]);

        var strength = 0;
        for (var j = 0; j < enemyShips.length; j++)
        {
          strength += enemyShips[j].currentStrength;
        }

        strengthByEnemy[hostilePlayers[i].id] = strength;
      }

      return strengthByEnemy;
    }

    getTotalHostileStrengthAtStar(star: Star)
    {
      var byPlayer = this.getHostileStrengthAtStar(star);

      var total = 0;

      for (var playerId in byPlayer)
      {
        total += byPlayer[playerId];
      }

      return total;
    }

    getRelativeTotalHostileStrengthAtStars(stars: Star[])
    {
      var absoluteByStar:
      {
        [starId: number]: number;
      } = {};

      var min, max;

      for (var i = 0; i < stars.length; i++)
      {
        var hostileStrength = this.getTotalHostileStrengthAtStar(stars[i]);
        absoluteByStar[stars[i].id] = hostileStrength;

        if (!isFinite(min) || hostileStrength < min) min = hostileStrength;
        if (!isFinite(max) || hostileStrength > max) max = hostileStrength;
      }

      var relativeByStar:
      {
        [starId: number]: number;
      } = {};

      for (var id in absoluteByStar)
      {
        relativeByStar[id] = getRelativeValue(absoluteByStar[id], min, max);
      }

      return relativeByStar;
    }

    evaluateStarIncome(star: Star): number
    {
      var evaluation = 0;

      evaluation += star.baseIncome;
      evaluation += (star.getIncome() - star.baseIncome) / 0.75;

      return evaluation;
    }

    evaluateStarInfrastructure(star: Star): number
    {
      var evaluation = 0;

      for (var category in star.buildings)
      {
        for (var i = 0; i < star.buildings[category].length; i++)
        {
          evaluation += star.buildings[category][i].totalCost;
        }
      }

      return evaluation;
    }

    getImmediateExpansionDesirability()
    {
      var stars = this.player.getNeighboringStars();

      var byDesirability:
      {
        [starId: number]: number;
      } = {};

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];

        var desirability = star.getIncome();

        byDesirability[star.id] = desirability;
      }
    }
  }
}
