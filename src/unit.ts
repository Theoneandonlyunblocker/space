/// <reference path="../data/templates/unittemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />

/// <reference path="unitattributes.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="item.ts"/>

module Rance
{
  export class Unit
  {
    template: Templates.IUnitTemplate;

    id: number;

    name: string;
    maxHealth: number;
    currentHealth: number;
    isSquadron: boolean;

    currentMovePoints: number;
    maxMovePoints: number;

    timesActedThisTurn: number;

    baseAttributes: IUnitAttributes;
    attributesAreDirty: boolean;
    cachedAttributes: IUnitAttributes;
    get attributes(): IUnitAttributes
    {
      if (this.attributesAreDirty || !this.cachedAttributes)
      {
        this.updateCachedAttributes();
      }

      return this.cachedAttributes;
    }

    battleStats:
    {
      moveDelay: number;
      side: string;
      position: number[];
      currentActionPoints: number;
      guardAmount: number;
      guardCoverage: string;
      captureChance: number;
      //queuedAction: Action;
    };

    displayFlags:
    {
      isAnnihilated: boolean;
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

    uiDisplayIsDirty: boolean = true;
    front: Front;

    constructor(template: Templates.IUnitTemplate, id?: number, data?)
    {
      this.id = isFinite(id) ? id : idGenerators.unit++;

      this.template = template;
      this.name = this.id + " " + template.typeName;
      this.isSquadron = template.isSquadron;
      if (data)
      {
        this.makeFromData(data);
      }
      else
      {
        this.setInitialValues();
      }

      this.displayFlags =
      {
        isAnnihilated: false
      };
    }
    makeFromData(data)
    {
      var items: any = {};

      ["low", "mid", "high"].forEach(function(slot)
      {
        if (data.items[slot])
        {
          var item = data.items[slot];
          if (!item) return;

          if (item.templateType)
          {
            items[slot] = new Item(Templates.Items[item.templateType], item.id);
          }
          else
          {
            items[slot] = item;
          }
        }
      });

      this.name = data.name;

      this.maxHealth = data.maxHealth;
      this.currentHealth = data.currentHealth;

      this.currentMovePoints = data.currentMovePoints;
      this.maxMovePoints = data.maxMovePoints;

      this.timesActedThisTurn = data.timesActedThisTurn;

      this.baseAttributes = extendObject(data.baseAttributes);
      this.attributes = extendObject(this.baseAttributes);

      var battleStats: any = {};

      battleStats.moveDelay = data.battleStats.moveDelay;
      battleStats.side = data.battleStats.side;
      battleStats.position = data.battleStats.position;
      battleStats.currentActionPoints = data.battleStats.currentActionPoints;
      battleStats.guardAmount = data.battleStats.guardAmount;
      battleStats.guardCoverage = data.battleStats.guardCoverage;
      battleStats.captureChance = data.battleStats.captureChance;

      this.battleStats = battleStats;


      this.items =
      {
        low: null,
        mid: null,
        high: null
      };

      for (var slot in items)
      {
        this.addItem(items[slot]);
      }
    }
    setInitialValues()
    {
      this.setBaseHealth();
      this.setAttributes();
      this.resetBattleStats();

      this.maxMovePoints = this.template.maxMovePoints;
      this.resetMovePoints();

      this.timesActedThisTurn = 0;
    }
    setBaseHealth()
    {
      var min = 500 * this.template.maxHealth;
      var max = 1000 * this.template.maxHealth;
      this.maxHealth = randInt(min, max);
      if (true)//(Math.random() > 0.5)
      {
        this.currentHealth = this.maxHealth;
      }
      else
      {
        this.currentHealth = randInt(this.maxHealth / 10, this.maxHealth);
      }
    }
    setAttributes(experience: number = 1, variance: number = 1)
    {
      var template = this.template;

      var attributes =
      {
        attack: 1,
        defence: 1,
        intelligence: 1,
        speed: 1,
        maxActionPoints: randInt(3, 6)
      }

      for (var attribute in template.attributeLevels)
      {
        var attributeLevel = template.attributeLevels[attribute];

        var min = 4 * experience * attributeLevel + 1;
        var max = 8 * experience * attributeLevel + 1 + variance;

        attributes[attribute] = randInt(min, max);
        if (attributes[attribute] > 9) attributes[attribute] = 9;
      }

      this.baseAttributes = extendObject(attributes);
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
        currentActionPoints: this.attributes.maxActionPoints,
        battle: null,
        side: null,
        position: null,
        guardAmount: 0,
        guardCoverage: null,
        captureChance: 0.1 // BASE_CAPTURE_CHANCE
      };

      this.displayFlags =
      {
        isAnnihilated: false
      };
    }
    setBattlePosition(battle: Battle, side: string, position: number[])
    {
      this.battleStats.side = side;
      this.battleStats.position = position;
    }

    addStrength(amount: number)
    {
      this.currentHealth += Math.round(amount);
      if (this.currentHealth > this.maxHealth)
      {
        this.currentHealth = this.maxHealth;
      }

      this.uiDisplayIsDirty = true;
    }
    removeStrength(amount: number)
    {
      this.currentHealth -= Math.round(amount);
      if (this.currentHealth < 0)
      {
        this.currentHealth = 0;
      }

      this.removeGuard(50);

      this.uiDisplayIsDirty = true;
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

      this.uiDisplayIsDirty = true;
    }
    addMoveDelay(amount: number)
    {
      this.battleStats.moveDelay += amount;
    }
    
    // redundant until stealth mechanics are added
    isTargetable()
    {
      return this.currentHealth > 0;
    }
    isActiveInBattle()
    {
      return this.currentHealth > 0;
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

      if (item.template.attributes)
      {
        this.attributesAreDirty = true;
      }
    }
    removeItem(item: Item)
    {
      var itemSlot = item.template.slot;

      if (this.items[itemSlot] === item)
      {
        this.items[itemSlot] = null;
        item.unit = null;

        if (item.template.attributes)
        {
          this.attributesAreDirty = true;
        }

        return true;
      }

      return false;
    }
    getAttributesWithItems()
    {
      var attributes = extendObject(this.baseAttributes);

      for (var itemSlot in this.items)
      {
        if (this.items[itemSlot])
        {
          var item = this.items[itemSlot];
          for (var attribute in item.template.attributes)
          {
            attributes[attribute] = clamp(
              attributes[attribute] + item.template.attributes[attribute], 0, 9);
          }
        }
      }

      return attributes;
    }
    /*
    sort by attribute, positive/negative, additive vs multiplicative
    apply +additive -additive +multiplicative -multiplicative
     */
    getAttributesWithEffects()
    {
      var withItems = this.getAttributesWithItems();

      return withItems;
    }
    updateCachedAttributes()
    {
      this.cachedAttributes = this.getAttributesWithEffects();
    }
    removeItemAtSlot(slot: string)
    {
      if (this.items[slot])
      {
        this.removeItem(this.items[slot]);
        return true;
      }

      return false;
    }
    getItemAbilities()
    {
      var itemAbilities = [];

      for (var slot in this.items)
      {
        if (!this.items[slot] || !this.items[slot].template.ability) continue;
        itemAbilities.push(this.items[slot].template.ability);
      }

      return itemAbilities;
    }
    getAllAbilities(): Templates.IAbilityTemplate[]
    {
      var abilities = this.template.abilities;

      abilities = abilities.concat(this.getItemAbilities());

      return abilities;
    }
    recieveDamage(amount: number, damageType: string)
    {
      var damageReduction = this.getReducedDamageFactor(damageType);

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
    getReducedDamageFactor(damageType: string)
    {
      var defensiveStat, defenceFactor;
      var finalDamageMultiplier = 1;

      switch (damageType)
      {
        case "physical":
        {
          defensiveStat = this.attributes.defence;
          defenceFactor = 0.08;

          var guardAmount = Math.min(this.battleStats.guardAmount, 100);
          finalDamageMultiplier = 1 - guardAmount / 200; // 1 - 0.5;
          break;
        }
        case "magical":
        {
          defensiveStat = this.attributes.intelligence;
          defenceFactor = 0.07;
          break;
        }
      }

      var damageReduction = defensiveStat * defenceFactor;
      var finalDamageFactor = (1 - damageReduction) * finalDamageMultiplier;

      return finalDamageFactor;
    }
    addToFleet(fleet: Fleet)
    {
      this.fleet = fleet;
    }
    removeFromFleet()
    {
      this.fleet = null;
    }
    removeFromPlayer()
    {
      var player = this.fleet.player;

      player.removeUnit(this);
      this.fleet.removeShip(this);

      if (this.front)
      {
        this.front.removeUnit(this);
      }

      this.uiDisplayIsDirty = true;
    }
    transferToPlayer(newPlayer: Player)
    {
      var oldPlayer = this.fleet.player;
      var location = this.fleet.location;

      this.removeFromPlayer();

      newPlayer.addUnit(this);
      var newFleet = new Fleet(newPlayer, [this], location);
    }
    removeGuard(amount: number)
    {
      this.battleStats.guardAmount -= amount;
      if (this.battleStats.guardAmount < 0) this.removeAllGuard();

      this.uiDisplayIsDirty = true;
    }
    addGuard(amount: number, coverage: string)
    {
      this.battleStats.guardAmount += amount;
      this.battleStats.guardCoverage = coverage;

      this.uiDisplayIsDirty = true;
    }
    removeAllGuard()
    {
      this.battleStats.guardAmount = 0;
      this.battleStats.guardCoverage = null;

      this.uiDisplayIsDirty = true;
    }
    canActThisTurn(): boolean
    {
      return this.timesActedThisTurn < 1;
    }
    heal()
    {
      var location = this.fleet.location;

      var baseHealFactor = 0.05;
      var healingFactor =
        baseHealFactor + location.getHealingFactor(this.fleet.player);

      var healAmount = this.maxHealth * healingFactor;

      this.addStrength(healAmount);
    }
    getStrengthEvaluation()
    {
      // TODO
      
      return this.currentHealth;
    }
    drawBattleScene(props:
    {
      unitsToDraw?: number;
      maxUnitsPerColumn: number;
      degree: number;
      rotationAngle: number;
      scalingFactor: number;
      xDistance: number;
      zDistance: number;
      facesRight: boolean;
      maxWidth?: number;
      maxHeight?: number;
      desiredHeight?: number;
    })
    {
      //var unitsToDraw = props.unitsToDraw;
      var maxUnitsPerColumn = props.maxUnitsPerColumn;
      var isConvex = true
      var degree = props.degree;
      if (degree < 0)
      {
        isConvex = !isConvex;
        degree = Math.abs(degree);
      }

      var xDistance = isFinite(props.xDistance) ? props.xDistance : 5;
      var zDistance = isFinite(props.zDistance) ? props.zDistance : 5;

      var canvas = document.createElement("canvas");
      canvas.width = 2000;
      canvas.height = 2000;

      var ctx = canvas.getContext("2d");

      var spriteTemplate = this.template.sprite;
      var image = app.images["units"][spriteTemplate.imageSrc];

      var unitsToDraw;

      if (isFinite(props.unitsToDraw))
      {
        unitsToDraw = props.unitsToDraw;
      }
      else
      {
        unitsToDraw = Math.round(this.currentHealth * 0.05);
        var heightRatio = 25 / image.height;
        heightRatio = Math.min(heightRatio, 1.25);
        maxUnitsPerColumn = Math.round(maxUnitsPerColumn * heightRatio);
        unitsToDraw = Math.round(unitsToDraw * heightRatio);
        zDistance *= (1 / heightRatio);

        unitsToDraw = clamp(unitsToDraw, 1, maxUnitsPerColumn * 3);
      }

      var xMin, xMax, yMin, yMax;

      function transformMat3(a, m)
      {
        var x = m[0] * a.x + m[3] * a.y + m[6];
        var y = m[1] * a.x + m[4] * a.y + m[7];

        return {x: x, y: y};
      }

      var rotationAngle = Math.PI / 180 * props.rotationAngle;
      var sA = Math.sin(rotationAngle);
      var cA = Math.cos(rotationAngle);

      var rotationMatrix =
      [
        1, 0, 0,
        0, cA, -sA,
        0, sA, cA
      ];

      var minXOffset = isConvex ? 0 : Math.sin(Math.PI / (maxUnitsPerColumn + 1));

      if (props.desiredHeight)
      {
        var averageHeight = image.height * (maxUnitsPerColumn / 2 * props.scalingFactor);
        var spaceToFill = props.desiredHeight - (averageHeight * maxUnitsPerColumn);
        zDistance = spaceToFill / maxUnitsPerColumn;
      }

      for (var i = unitsToDraw - 1; i >= 0; i--)
      {
        var column = Math.floor(i / maxUnitsPerColumn);
        var isLastColumn = column === Math.floor(unitsToDraw / maxUnitsPerColumn);

        var zPos;
        if (isLastColumn)
        {
          var maxUnitsInThisColumn = unitsToDraw % maxUnitsPerColumn;
          if (maxUnitsInThisColumn === 1)
          {
            zPos = (maxUnitsPerColumn - 1) / 2;
          }
          else
          {
            var positionInLastColumn = i % maxUnitsInThisColumn;
            zPos = positionInLastColumn * ((maxUnitsPerColumn - 1) / (maxUnitsInThisColumn - 1));
          }
        }
        else
        {
          zPos = i % maxUnitsPerColumn;
        }

        var xOffset = Math.sin(Math.PI / (maxUnitsPerColumn + 1) * (zPos + 1));
        if (isConvex)
        {
          xOffset = 1 - xOffset;
        }

        xOffset -= minXOffset;

        var scale = 1 - zPos * props.scalingFactor;
        var scaledWidth = image.width * scale;
        var scaledHeight = image.height * scale;
        

        var x = xOffset * scaledWidth * degree + column * (scaledWidth + xDistance * scale);
        var y = (scaledHeight + zDistance * scale) * (maxUnitsPerColumn - zPos);

        var translated = transformMat3({x: x, y: y}, rotationMatrix);

        x = Math.round(translated.x);
        y = Math.round(translated.y);

        xMin = isFinite(xMin) ? Math.min(x, xMin) : x;
        xMax = isFinite(xMax) ? Math.max(x + scaledWidth, xMax) : x + scaledWidth;
        yMin = isFinite(yMin) ? Math.min(y, yMin) : y;
        yMax = isFinite(yMax) ? Math.max(y + scaledHeight, yMax) : y + scaledHeight;


        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
      }

      var resultCanvas = document.createElement("canvas");

      resultCanvas.width = xMax - xMin;
      if (props.maxWidth)
      {
        resultCanvas.width = Math.min(props.maxWidth, resultCanvas.width)
      }

      resultCanvas.height = yMax - yMin;
      if (props.maxHeight)
      {
        resultCanvas.height = Math.min(props.maxHeight, resultCanvas.height)
      }

      var resultCtx = resultCanvas.getContext("2d");

      // flip horizontally
      if (props.facesRight)
      {
        resultCtx.translate(resultCanvas.width, 0);
        resultCtx.scale(-1, 1);
      }
      resultCtx.drawImage(canvas, -xMin, -yMin);


      return resultCanvas;
    }
    serialize(includeItems: boolean = true)
    {
      var data: any = {};

      data.templateType = this.template.type;
      data.id = this.id;
      data.name = this.name;

      data.maxHealth = this.maxHealth;
      data.currentHealth = this.currentHealth;

      data.currentMovePoints = this.currentMovePoints;
      data.maxMovePoints = this.maxMovePoints;

      data.timesActedThisTurn = this.timesActedThisTurn;

      data.baseAttributes = extendObject(this.baseAttributes);

      data.battleStats = {};
      data.battleStats.moveDelay = this.battleStats.moveDelay;
      data.battleStats.side = this.battleStats.side;
      data.battleStats.position = this.battleStats.position;
      data.battleStats.currentActionPoints = this.battleStats.currentActionPoints;
      data.battleStats.guardAmount = this.battleStats.guardAmount;
      data.battleStats.guardCoverage = this.battleStats.guardCoverage;
      data.battleStats.captureChance = this.battleStats.captureChance;

      if (this.fleet)
      {
        data.fleetId = this.fleet.id;
      }

      data.items = {};

      if (includeItems)
      {
        for (var slot in this.items)
        {
          if (this.items[slot]) data.items[slot] = this.items[slot].serialize();
        }
      }

      return data;
    }
    makeVirtualClone()
    {
      var data = this.serialize();
      var clone = new Unit(this.template, this.id, data);

      return clone;
    }
  }
}
