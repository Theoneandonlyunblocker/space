/// <reference path="../player.ts"/>
/// <reference path="../galaxymap.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="front.ts"/>
/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>

module Rance
{
  export class FrontsAI
  {
    player: Player;
    map: GalaxyMap;
    mapEvaluator: MapEvaluator;
    objectivesAI: ObjectivesAI;

    fronts: Front[] = [];
    requests: any[] = [];

    constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
    {
      this.mapEvaluator = mapEvaluator;
      this.map = mapEvaluator.map;
      this.player = mapEvaluator.player;
      this.objectivesAI = objectivesAI;
    }

    processObjectives()
    {
      var objectives = this.objectivesAI.objectives;

      // evaluate unit fit
    }

    assignUnits()
    {
      var units = this.player.units;
    }

    getUnitsToFillExpansionObjective(objective: Objective)
    {
      var star = objective.target;
      var independentShips = star.getAllShipsOfPlayer(star.owner);

      if (independentShips.length === 1) return 2;
      else
      {
        var desired = independentShips.length + 2;
        return Math.min(desired, 6);
      }
    }
  }
}
