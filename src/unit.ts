/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />

/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="pathfinding.ts"/>

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.unit = idGenerators.unit || 0;

  export class Unit
  {
    template: Templates.TypeTemplate;

    id: number;

    name: string;
    maxStrength: number;
    currentStrength: number;
    isSquadron: boolean;

    currentMovePoints: number;
    maxMovePoints: number;

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

    // map
    
    fleet: Fleet;

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

      this.maxMovePoints = this.template.maxMovePoints;
      this.resetMovePoints();
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

        var min = 4 * experience * attributeLevel + 1;
        var max = 8 * experience * attributeLevel + 1 + variance;

        attributes[attribute] = randInt(min, max);
        if (attributes[attribute] > 9) attributes[attribute] = 9;
      }

      this.attributes = attributes;
    }
    getBaseMoveDelay()
    {
      return 30 - this.attributes.speed;
    }
    resetMovePoints()
    {
      this.currentMovePoints = this.maxMovePoints;
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
    getAttackDamageIncrease(damageType: string)
    {
      var attackStat, attackFactor;

      switch (damageType)
      {
        case "physical":
        {
          attackStat = this.attributes.attack;
          attackFactor = 0.1;
          break;
        }
        case "magical":
        {
          attackStat = this.attributes.intelligence;
          attackFactor = 0.1;
          break;
        }
      }

      return attackStat * attackFactor;
    }
    getDamageReduction(damageType: string)
    {
      var defensiveStat, defenceFactor;

      switch (damageType)
      {
        case "physical":
        {
          defensiveStat = this.attributes.defence;
          defenceFactor = 0.08;
          break;
        }
        case "magical":
        {
          defensiveStat = this.attributes.intelligence;
          defenceFactor = 0.07;
          break;
        }
      }

      return defensiveStat * defenceFactor;
    }
    addToFleet(fleet: Fleet)
    {
      this.fleet = fleet;
    }
    removeFromFleet()
    {
      this.fleet = null;
    }
    die()
    {
      var player = this.fleet.player;

      player.removeUnit(this);
      this.fleet.removeShip(this);
    }
  }
}
