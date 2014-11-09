/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />

/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>

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
    

    attributes:
    {
      attack: number;
      defence: number;
      intelligence: number;
      speed: number;
    };

    battleStats:
    {
      battle: Battle;
      moveDelay: number;
      side: string;
      position: number[];
      currentActionPoints: number;
      //queuedAction: Action;
    };

    abilities: Templates.AbilityTemplate[];

    constructor(template: Templates.TypeTemplate)
    {
      this.id = idGenerators.unit++;

      this.template = template;
      this.abilities = template.abilities;
      this.name = this.id + " " + template.typeName;
      this.isSquadron = template.isSquadron;
      this.setValues();
    }
    setValues()
    {
      this.setBaseHealth();
      this.setActionPoints();
      this.setAttributes();
      this.resetBattleStats();
    }
    setBaseHealth()
    {
      var min = 500 * this.template.maxStrength;
      var max = 1000 * this.template.maxStrength;
      this.maxStrength = randInt(min, max);
      if (true)//(Math.random() > 0.5)
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
        moveDelay: this.getBaseMoveDelay(),
        currentActionPoints: this.maxActionPoints,
        battle: null,
        side: null,
        position: null
      }
    }
    setBattlePosition(battle: Battle, side: string, position: number[])
    {
      this.battleStats.battle = battle;
      this.battleStats.side = side;
      this.battleStats.position = position;
    }

    removeStrength(amount: number)
    {
      this.currentStrength -= amount;
      if (this.currentStrength < 0)
      {
        this.currentStrength = 0;
      }
    }
    removeActionPoints(amount: any)
    {
      if (amount === "all")
      {
        this.battleStats.currentActionPoints = 0;
      }
      else if (isFinite(amount))
      {
        this.battleStats.currentActionPoints -= amount;
        if (this.battleStats.currentActionPoints < 0)
        {
          this.battleStats.currentActionPoints = 0;
        }
      }
    }
    addMoveDelay(amount: number)
    {
      this.battleStats.moveDelay += amount;
    }
    isTargetable()
    {
      return this.currentStrength > 0;
    }
  }
}
