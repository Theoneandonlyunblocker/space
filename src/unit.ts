/// <reference path="../data/templates/typetemplates.ts" />

/// <reference path="utility.ts"/>

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.unit = 0;

  export class Unit
  {
    template: Templates.TypeTemplate;

    id: number;

    name: string;
    maxStrength: number;
    currentStrength: number;
    isSquadron: boolean;

    maxActionPoints: number;    
    currentActionPoints: number;

    attributes:
    {
      attack: number;
      defence: number;
      intelligence: number;
      speed: number;
    };

    battleStats:
    {
      moveDelay: number;
      //queuedAction: Action;
    };

    constructor(template: Templates.TypeTemplate)
    {
      this.id = idGenerators.unit++;

      this.template = template;
      this.name = this.id + " " + template.typeName;
      this.isSquadron = template.isSquadron;
      this.setValues();
    }
    setValues()
    {
      this.setBaseHealth();
      this.setActionPoints();
      this.setAttributes();
    }
    setBaseHealth()
    {
      var min = 500 * this.template.maxStrength;
      var max = 1000 * this.template.maxStrength;
      this.maxStrength = randInt(min, max);
      if (Math.random() > 0.5)
      {
        this.currentStrength = this.maxStrength;
      }
      else
      {
        this.currentStrength = randInt(this.maxStrength / 10, this.maxStrength);
      }
    }
    setActionPoints()
    {
      this.maxActionPoints = randInt(3, 6);
      this.currentActionPoints = randInt(0, this.maxActionPoints);
    }
    setAttributes(experience: number = 1, variance: number = 1)
    {
      var template = this.template;

      var attributes =
      {
        attack: 1,
        defence: 1,
        intelligence: 1,
        speed: 1
      }

      for (var attribute in template.attributeLevels)
      {
        var attributeLevel = template.attributeLevels[attribute];

        var min = 8 * experience * attributeLevel + 1;
        var max = 16 * experience * attributeLevel + 1 + variance;

        attributes[attribute] = randInt(min, max);
        if (attributes[attribute] > 20) attributes[attribute] = 20;
      }

      this.attributes = attributes;
    }
    getBaseMoveDelay()
    {
      return 30 - this.attributes.speed;
    }
    resetBattleStats()
    {
      this.battleStats =
      {
        moveDelay: this.getBaseMoveDelay()
      }
    }
  }
}
