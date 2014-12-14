/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />

/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="pathfinding.ts"/>
/// <reference path="item.ts"/>

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
      guard:
      {
        value: number;
        coverage: string;
      }
      //queuedAction: Action;
    };
    
    fleet: Fleet;

    items:
    {
      low: Item;
      mid: Item;
      high: Item;
    } =
    {
      low: null,
      mid: null,
      high: null
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
        position: null,
        guard:
        {
          coverage: null,
          value: 0
        }
      }
    }
    setBattlePosition(battle: Battle, side: string, position: number[])
    {
      this.battleStats.battle = battle;
      this.battleStats.side = side;
      this.battleStats.position = position;
    }

    addStrength(amount: number)
    {
      this.currentStrength += Math.round(amount);
      if (this.currentStrength > this.maxStrength)
      {
        this.currentStrength = this.maxStrength;
      }
    }
    removeStrength(amount: number)
    {
      this.currentStrength -= Math.round(amount);
      if (this.currentStrength < 0)
      {
        this.currentStrength = 0;
      }

      this.removeGuard(50);
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
    addItem(item: Item)
    {
      var itemSlot = item.template.slot;

      if (this.items[itemSlot]) return false;

      if (item.unit)
      {
        item.unit.removeItem(item);
      }

      this.items[itemSlot] = item;
      item.unit = this;
    }
    removeItem(item: Item)
    {
      var itemSlot = item.template.slot;

      if (this.items[itemSlot] === item)
      {
        this.items[itemSlot] = null;
        item.unit = null;
        return true;
      }

      return false;
    }
    getItemAbilities()
    {
      var itemAbilities = [];

      for (var slot in this.items)
      {
        itemAbilities = itemAbilities.concat(this.items[slot].template.abilities);
      }

      return itemAbilities;
    }
    getAllAbilities()
    {
      var abilities = this.template.abilities;

      abilities = abilities.concat(this.getItemAbilities());

      return abilities;
    }
    recieveDamage(amount: number, damageType: string)
    {
      var damageReduction = this.getDamageReduction(damageType);

      var adjustedDamage = amount * damageReduction;

      this.removeStrength(adjustedDamage);
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

      return 1 + attackStat * attackFactor;
    }
    getDamageReduction(damageType: string)
    {
      var defensiveStat, defenceFactor;

      switch (damageType)
      {
        case "physical":
        {
          defensiveStat = this.attributes.defence;
          var guardAmount = Math.min(this.battleStats.guard.value, 100);
          defensiveStat *= (1 + guardAmount / 100);
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

      console.log(1-defensiveStat * defenceFactor)
      return 1 - defensiveStat * defenceFactor;
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
    removeGuard(amount: number)
    {
      this.battleStats.guard.value -= amount;
      if (this.battleStats.guard.value < 0) this.removeAllGuard();
    }
    addGuard(amount: number, coverage: string)
    {
      this.battleStats.guard.value += amount;
      this.battleStats.guard.coverage = coverage;
    }
    removeAllGuard()
    {
      this.battleStats.guard.value = 0;
      this.battleStats.guard.coverage = null;
    }
    heal()
    {
      var location = this.fleet.location;

      var baseHealFactor = 0.1;
      var healingFactor =
        baseHealFactor + location.getHealingFactor(this.fleet.player);

      var healAmount = this.maxStrength * healingFactor;

      this.addStrength(healAmount);
    }
    serialize()
    {
      var data: any = {};

      data.templateType = this.template.type;
      data.id = this.id;
      data.name = this.name;

      data.maxStrength = this.maxStrength;
      data.currentStrength = this.currentStrength;

      data.currentMovePoints = this.currentMovePoints;
      data.maxMovePoints = this.maxMovePoints;

      data.attributes = this.attributes;

      data.battleStats = {};
      data.battleStats.moveDelay = this.battleStats.moveDelay;
      data.side = this.battleStats.side;
      data.position = this.battleStats.position;
      data.currentActionPoints = this.battleStats.currentActionPoints;
      data.guard = this.battleStats.guard;

      data.fleetId = this.fleet.id;

      return data;
    }
  }
}
