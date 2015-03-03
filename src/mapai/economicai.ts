/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>

/// <reference path="objectivesai.ts"/>
/// <reference path="frontsai.ts"/>

module Rance
{
  
  export class EconomicAI
  {
    objectivesAI: ObjectivesAI;
    frontsAI: FrontsAI;

    player: Player;
    map: GalaxyMap;

    totalUnitCountByArchetype:
    {
      [unitArchetype: string]: number;
    } = {};

    resetTotalUnitCountByArchetype()
    {
      this.totalUnitCountByArchetype = {};

      var units = this.player.units;
      for (var i = 0; i < units.length; i++)
      {
        if (!this.totalUnitCountByArchetype[unit.archetype])
        {
          this.totalUnitCountByArchetype[unit.archetype] = 0;
        }

        this.totalUnitCountByArchetype[unit.archetype]++;
      }
    }


    satisfyFrontRequest(front: Front, request: any)
    {
      
    }
  }
}
