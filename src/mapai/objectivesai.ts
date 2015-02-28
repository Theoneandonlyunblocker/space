/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>
/// <reference path="mapevaluator.ts"/>
/// <reference path="expansionrequest.ts"/>

// figure out what we want to do
//   various short to medium term goals are assigned priorities
//   
// evaluate current requests if any
// send new requests


/*
evaluate expansion as most important nearby goal

 */


module Rance
{
  export class ObjectivesAI
  {
    mapEvaluator: MapEvaluator;
    map: GalaxyMap;
    player: Player;
    game: Game;

    indexedObjectives:
    {
      [objectiveType: string]: any;
    } = {};
    objectives: any[] = [];

    maxActiveExpansionRequests: number;

    constructor(mapEvaluator: MapEvaluator, game: Game)
    {
      this.mapEvaluator = mapEvaluator;
      this.map = mapEvaluator.map;
      this.player = mapEvaluator.player;
      this.game = game;
    }

    processObjectives()
    {

    }

    getDesireToExpand()
    {
      var neighboringStars = this.player.getNeighboringStars();

      var independentNeighbors = neighboringStars.filter(function(star)
      {
        return star.owner.isIndependent;
      });

      if (independentNeighbors.length <= 0)
      {
        return 0;
      }

      var starsPerPlayer = this.map.stars.length / this.game.playerOrder.length;
      var minDesiredStars = starsPerPlayer / 2;

      var desire = minDesiredStars / this.player.controlledLocations.length;
      desire = clamp(desire, 0, 1);

      return desire;
    }
    getShipsNeededToExpand()
    {
      var expansionEvaluations = this.mapEvaluator.evaluateImmediateExpansionTargets();
      var expansionScores = this.mapEvaluator.scoreExpansionTargets(expansionEvaluations);

      var bestStar = expansionScores[0].star;
      var bestStarEvaluation = expansionEvaluations[bestStar.id];
      var independentStrengthAtBestStar = bestStarEvaluation.independentStrength;
      var ownInfluenceAtBestStar = bestStarEvaluation.ownInfluence;

      return Math.round((1000 + independentStrengthAtBestStar - ownInfluenceAtBestStar) / 500);
    }
  }
}
