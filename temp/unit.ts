/// <reference path="templateinterfaces/iunittemplate.d.ts" />

/// <reference path="damagetype.ts" />
/// <reference path="iunitattributes.d.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="item.ts"/>
/// <reference path="statuseffect.ts" />

/// <reference path="savedata/iunitsavedata.d.ts" />

export type UnitBattleSide = "side1" | "side2";
export var UnitBattleSidesArray: UnitBattleSide[] = ["side1", "side2"];

export enum GuardCoverage
{
  row,
  all
}

export interface IQueuedActionData
{
  ability: AbilityTemplate;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}

export interface IUnitBattleStats
{
  moveDelay: number;
  side: UnitBattleSide;
  position: number[];
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage;
  captureChance: number;
  statusEffects: StatusEffect[];
  lastHealthBeforeReceivingDamage: number;
  queuedAction: IQueuedActionData;
  isAnnihilated: boolean;
}

export interface IUnitItems
{
  low: Item;
  mid: Item;
  high: Item;
}

export class Unit
{
  template: UnitTemplate;

  id: number;

  name: string;
  portrait: PortraitTemplate;

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

  battleStats: IUnitBattleStats;

  abilities: AbilityTemplate[] = [];
  passiveSkills: PassiveSkillTemplate[] = [];

  experienceForCurrentLevel: number;
  level: number;

  fleet: Fleet;

  items: IUnitItems =
  {
    low: null,
    mid: null,
    high: null
  };

  passiveSkillsByPhase:
  {
    atBattleStart?: PassiveSkillTemplate[];
    beforeAbilityUse?: PassiveSkillTemplate[];
    afterAbilityUse?: PassiveSkillTemplate[];
    atTurnStart?: PassiveSkillTemplate[];
    inBattlePrep?: PassiveSkillTemplate[];
  } = {};
  passiveSkillsByPhaseAreDirty: boolean = true;

  
  front: MapAI.Front;

  uiDisplayIsDirty: boolean = true;
  // todo old
  displayFlags:
  {
    isAnnihilated: boolean;
  };
  sfxDuration: number;
  lastHealthDrawnAt: number;
  // end old
  // new
  displayedHealth: number;
  
  // end new
  constructor(template: UnitTemplate, id?: number, data?: IUnitSaveData)
  {
    this.id = isFinite(id) ? id : idGenerators.unit++;

    this.template = template;
    this.isSquadron = template.isSquadron;
    if (data)
    {
      this.makeFromData(data);
    }
    else
    {
      this.setCulture();
      this.setInitialValues();
    }

    this.displayFlags =
    {
      isAnnihilated: false
    };
  }
  makeFromData(data: IUnitSaveData)
  {
    this.name = data.name;

    this.maxHealth = data.maxHealth;
    this.currentHealth = data.currentHealth;

    this.currentMovePoints = data.currentMovePoints;
    this.maxMovePoints = data.maxMovePoints;

    this.timesActedThisTurn = data.timesActedThisTurn;

    this.baseAttributes = extendObject(data.baseAttributes);
    this.attributes = extendObject(this.baseAttributes);

    this.abilities = data.abilityTemplateTypes.map(function(key: string)
    {
      var template = app.moduleData.Templates.Abilities[key];

      if (!template)
      {
        throw new Error("Couldn't find ability " + key);
      }

      return template;
    });
    
    this.passiveSkills = data.passiveSkillTemplateTypes.map(function(key: string)
    {
      var template = app.moduleData.Templates.PassiveSkills[key];

      if (!template)
      {
        throw new Error("Couldn't find passive skill " + key);
      }

      return template;
    });

    this.experienceForCurrentLevel = data.experienceForCurrentLevel;
    this.level = data.level;

    this.battleStats =
    {
      moveDelay: data.battleStats.moveDelay,
      side: data.battleStats.side,
      position: data.battleStats.position,
      currentActionPoints: data.battleStats.currentActionPoints,
      guardAmount: data.battleStats.guardAmount,
      guardCoverage: data.battleStats.guardCoverage,
      captureChance: data.battleStats.captureChance,
      statusEffects: data.battleStats.statusEffects,
      lastHealthBeforeReceivingDamage: this.currentHealth,
      queuedAction: !data.battleStats.queuedAction ? null :
      {
        ability: app.moduleData.Templates.Abilities[data.battleStats.queuedAction.abilityTemplateKey],
        targetId: data.battleStats.queuedAction.targetId,
        turnsPrepared: data.battleStats.queuedAction.turnsPrepared,
        timesInterrupted: data.battleStats.queuedAction.timesInterrupted
      },
      isAnnihilated: data.battleStats.isAnnihilated
    };

    var items: any = {};

    ["low", "mid", "high"].forEach(function(slot)
    {
      if (data.items[slot])
      {
        var item = data.items[slot];
        if (!item) return;

        items[slot] = new Item(app.moduleData.tems[item.templateType], item.id);
      }
    });

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

    if (data.portraitKey)
    {
      this.portrait = findItemWithKey<PortraitTemplate>(
        app.moduleData.Templates.Cultures, data.portraitKey, "portraits");
    }
  }
  setInitialValues()
  {
    this.setBaseHealth();
    this.setAttributes();
    this.resetBattleStats();

    this.maxMovePoints = this.template.maxMovePoints;
    this.resetMovePoints();
    this.setInitialAbilities();
    this.setInitialPassiveSkills();

    this.level = 1;
    this.experienceForCurrentLevel = 0;

    this.timesActedThisTurn = 0;
  }
  setBaseHealth(multiplier: number = 1)
  {
    var min = 200 * this.template.maxHealth * multiplier;
    var max = 300 * this.template.maxHealth * multiplier;
    this.maxHealth = randInt(min, max);
    
    this.currentHealth = this.maxHealth;
  }
  setAttributes(baseSkill: number = 1, variance: number = 1)
  {
    var template = this.template;

    var attributes =
    {
      attack: 1,
      defence: 1,
      intelligence: 1,
      speed: 1,
      maxActionPoints: randInt(3, 5)
    }

    for (var attribute in template.attributeLevels)
    {
      var attributeLevel = template.attributeLevels[attribute];

      var min = Math.max(3 * baseSkill * attributeLevel, 1);
      var max = Math.max(5 * baseSkill * attributeLevel + variance, 1);

      attributes[attribute] = randInt(min, max);
      if (attributes[attribute] > 9) attributes[attribute] = 9;
    }

    this.baseAttributes = extendObject(attributes);
    this.attributes = attributes;
    this.attributesAreDirty = true;
  }
  setCulture()
  {
    var templateCultures = this.template.cultures;

    var nameGeneratorFN: (unit: Unit) => string;
    var nameGeneratorCandidateCultures: CultureTemplate[] = templateCultures.filter(
      function(cultureTemplate: CultureTemplate)
    {
      return Boolean(cultureTemplate.nameGenerator);
    });

    if (nameGeneratorCandidateCultures.length > 0)
    {
      nameGeneratorFN = getRandomArrayItem(nameGeneratorCandidateCultures).nameGenerator;
    }
    else
    {
      nameGeneratorFN = defaultNameGenerator;
    }

    this.name = nameGeneratorFN(this);


    var portraitCandidateCultures: CultureTemplate[] = templateCultures.filter(
      function(cultureTemplate: CultureTemplate)
    {
      return Boolean(cultureTemplate.portraits);
    });

    if (portraitCandidateCultures.length === 0)
    {
      portraitCandidateCultures = getAllPropertiesWithKey(app.moduleData.Templates.Cultures, "portraits");
      if (portraitCandidateCultures.length === 0)
      {
        console.warn("No culture has portraits specified"); //TODO culture
        return;
      }
    }


    var portraitCandidateCulturesWithWeights: any =
      portraitCandidateCultures.map(function(culture: CultureTemplate)
    {
      return(
      {
        weight: Object.keys(culture.portraits).length,
        culture: culture
      });
    });

    var portraitCulture = getRandomArrayItemWithWeights<any>(portraitCandidateCulturesWithWeights).culture;
    this.portrait = getRandomProperty(portraitCulture.portraits);
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
      side: null,
      position: null,
      guardAmount: 0,
      guardCoverage: null,
      captureChance: app.moduleData.ruleSet.battle.baseUnitCaptureChance,
      statusEffects: [],
      lastHealthBeforeReceivingDamage: this.currentHealth,
      queuedAction: null,
      isAnnihilated: false
    };

    this.displayFlags =
    {
      isAnnihilated: false
    };
  }
  setBattlePosition(battle: Battle, side: UnitBattleSide, position: number[])
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
    this.currentHealth = clamp(this.currentHealth, 0, this.maxHealth);

    if (amount > 0)
    {
      this.removeGuard(40);
    }

    if (this.currentHealth === 0)
    {
      this.battleStats.isAnnihilated = true;
    }

    this.uiDisplayIsDirty = true;
  }
  removeActionPoints(amount: number)
  {
    this.battleStats.currentActionPoints -= amount;
    if (this.battleStats.currentActionPoints < 0)
    {
      this.battleStats.currentActionPoints = 0;
    }

    this.uiDisplayIsDirty = true;
  }
  addMoveDelay(amount: number)
  {
    this.battleStats.moveDelay += amount;
  }
  updateStatusEffects()
  {
    for (var i = 0; i < this.battleStats.statusEffects.length; i++)
    {
      this.battleStats.statusEffects[i].processTurnEnd();
      if (this.battleStats.statusEffects[i].duration === 0)
      {
        this.removeStatusEffect(this.battleStats.statusEffects[i]);
      }
    }

    this.uiDisplayIsDirty = true;
  }
  setQueuedAction(ability: AbilityTemplate, target: Unit)
  {
    this.battleStats.queuedAction =
    {
      ability: ability,
      targetId: target.id,
      turnsPrepared: 0,
      timesInterrupted: 0
    }

    this.uiDisplayIsDirty = true;
  }
  interruptQueuedAction(interruptStrength: number)
  {
    var action = this.battleStats.queuedAction;
    if (!action) return;

    action.timesInterrupted += interruptStrength;
    if (action.timesInterrupted >= action.ability.preparation.interruptsNeeded)
    {
      this.clearQueuedAction();
    }

    this.uiDisplayIsDirty = true;
  }
  updateQueuedAction()
  {
    var action = this.battleStats.queuedAction;
    if (!action) return;

    action.turnsPrepared++;

    this.uiDisplayIsDirty = true;
  }
  isReadyToUseQueuedAction()
  {
    var action = this.battleStats.queuedAction;

    return (action && action.turnsPrepared >= action.ability.preparation.turnsToPrep);
  }
  clearQueuedAction()
  {
    this.battleStats.queuedAction = null;
    this.uiDisplayIsDirty = true;
  }
  
  // TODO gameplay | allow units to become untargetable in battle (cloaking?)
  isTargetable()
  {
    return this.isActiveInBattle();
  }
  isActiveInBattle()
  {
    return this.currentHealth > 0 && !this.battleStats.isAnnihilated;
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
    if (item.template.passiveSkill)
    {
      this.passiveSkillsByPhaseAreDirty = true;
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
      if (item.template.passiveSkill)
      {
        this.passiveSkillsByPhaseAreDirty = true;
      }

      return true;
    }

    return false;
  }
  destroyAllItems()
  {
    for (var slot in this.items)
    {
      var item = this.items[slot];
      if (item)
      {
        this.fleet.player.removeItem(item);
      }
    }
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
            attributes[attribute] + item.template.attributes[attribute], 1, 9);
        }
      }
    }

    return attributes;
  }
  addStatusEffect(statusEffect: StatusEffect)
  {
    if (this.battleStats.statusEffects.indexOf(statusEffect) !== -1)
    {
      throw new Error("Tried to add duplicate status effect to unit " + this.name);
    }
    else if (statusEffect.duration === 0)
    {
      console.warn("Tried to add status effect", statusEffect, "with 0 duration");
      return;
    }

    this.battleStats.statusEffects.push(statusEffect);
    if (statusEffect.template.attributes)
    {
      this.attributesAreDirty = true;
    }
    if (statusEffect.template.passiveSkills)
    {
      this.passiveSkillsByPhaseAreDirty = true;
    }

    this.uiDisplayIsDirty = true;
  }
  removeStatusEffect(statusEffect: StatusEffect)
  {
    var index = this.battleStats.statusEffects.indexOf(statusEffect);
    if (index === -1)
    {
      throw new Error("Tried to remove status effect not active on unit " + this.name);
    }

    this.battleStats.statusEffects.splice(index, 1);
    if (statusEffect.template.attributes)
    {
      this.attributesAreDirty = true;
    }
    if (statusEffect.template.passiveSkills)
    {
      this.passiveSkillsByPhaseAreDirty = true;
    }

    this.uiDisplayIsDirty = true;
  }
  /*
  sort by attribute, positive/negative, additive vs multiplicative
  apply additive, multiplicative
   */
  getTotalStatusEffectAttributeAdjustments()
  {
    if (!this.battleStats || !this.battleStats.statusEffects)
    {
      return null;
    }

    var adjustments: StatusEffectAttributes = {};
    for (var i = 0; i < this.battleStats.statusEffects.length; i++)
    {
      var statusEffect = this.battleStats.statusEffects[i];
      if (!statusEffect.template.attributes) continue;

      for (var attribute in statusEffect.template.attributes)
      {
        adjustments[attribute] = {};
        for (var type in statusEffect.template.attributes[attribute])
        {
          if (!adjustments[attribute][type])
          {
            adjustments[attribute][type] = 0;
          }

          adjustments[attribute][type] += statusEffect.template.attributes[attribute][type];
        }
      }
    }

    return adjustments;
  }
  getAttributesWithEffects()
  {
    var withItems = this.getAttributesWithItems();

    var adjustments = this.getTotalStatusEffectAttributeAdjustments();
    for (var attribute in adjustments)
    {
      if (adjustments[attribute].flat)
      {
        withItems[attribute] += adjustments[attribute].flat;
      }
      if (adjustments[attribute].multiplier)
      {
        withItems[attribute] *= 1 + adjustments[attribute].multiplier;
      }

      withItems[attribute] = clamp(withItems[attribute], -5, 20);
    }

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
  setInitialAbilities()
  {
    this.abilities = getItemsFromWeightedProbabilities(this.template.possibleAbilities);
  }
  setInitialPassiveSkills()
  {
    if (this.template.possiblePassiveSkills)
    {
      this.passiveSkills = getItemsFromWeightedProbabilities(this.template.possiblePassiveSkills);
    }
  }
  getItemAbilities(): AbilityTemplate[]
  {
    var itemAbilities: AbilityTemplate[] = [];

    for (var slot in this.items)
    {
      if (!this.items[slot] || !this.items[slot].template.ability) continue;
      itemAbilities.push(this.items[slot].template.ability);
    }

    return itemAbilities;
  }
  getAllAbilities(): AbilityTemplate[]
  {
    return this.abilities.concat(this.getItemAbilities());
  }
  getItemPassiveSkills(): PassiveSkillTemplate[]
  {
    var itemPassiveSkills: PassiveSkillTemplate[] = [];

    for (var slot in this.items)
    {
      if (!this.items[slot] || !this.items[slot].template.passiveSkill) continue;
      itemPassiveSkills.push(this.items[slot].template.passiveSkill);
    }

    return itemPassiveSkills;
  }
  getStatusEffectPassiveSkills(): PassiveSkillTemplate[]
  {
    var statusEffectPassiveSkills: PassiveSkillTemplate[] = [];

    if (!this.battleStats || !this.battleStats.statusEffects)
    {
      return statusEffectPassiveSkills;
    }

    for (var i = 0; i < this.battleStats.statusEffects.length; i++)
    {
      var templateSkills = this.battleStats.statusEffects[i].template.passiveSkills;
      if (templateSkills)
      {
        statusEffectPassiveSkills = statusEffectPassiveSkills.concat(templateSkills);
      }
    }

    return statusEffectPassiveSkills;
  }
  getAllPassiveSkills(): PassiveSkillTemplate[]
  {
    var allSkills: PassiveSkillTemplate[] = [];
    allSkills = allSkills.concat(this.passiveSkills);

    allSkills = allSkills.concat(this.getItemPassiveSkills());
    allSkills = allSkills.concat(this.getStatusEffectPassiveSkills());

    return allSkills;
  }
  updatePassiveSkillsByPhase(): void
  {
    var updatedSkills = {};

    var allSkills = this.getAllPassiveSkills();

    for (var i = 0; i < allSkills.length; i++)
    {
      var skill = allSkills[i];
      ["atBattleStart", "beforeAbilityUse", "afterAbilityUse", "atTurnStart", "inBattlePrep"].forEach(function(phase)
      {
        if (skill[phase])
        {
          if (!updatedSkills[phase])
          {
            updatedSkills[phase] = [];
          }

          if (updatedSkills[phase].indexOf(skill) === -1)
          {
            updatedSkills[phase].push(skill);
          }
        }
      });
    }

    this.passiveSkillsByPhase = updatedSkills;
    this.passiveSkillsByPhaseAreDirty = false;
  }
  getPassiveSkillsByPhase()
  {
    if (this.passiveSkillsByPhaseAreDirty)
    {
      this.updatePassiveSkillsByPhase();
    }

    return this.passiveSkillsByPhase;
  }
  receiveDamage(amount: number, damageType: DamageType)
  {
    var damageReduction = this.getReducedDamageFactor(damageType);

    var adjustedDamage = amount * damageReduction;

    this.battleStats.lastHealthBeforeReceivingDamage = this.currentHealth;
    this.removeStrength(adjustedDamage);
  }
  getAdjustedTroopSize()
  {
    // used so unit will always counter with at least 1/3 strength it had before being attacked
    var balancedHealth = this.currentHealth + this.battleStats.lastHealthBeforeReceivingDamage / 3;
    this.battleStats.lastHealthBeforeReceivingDamage = this.currentHealth;

    var currentHealth = this.isSquadron ?
      balancedHealth :
      Math.min(this.maxHealth, balancedHealth + this.maxHealth * 0.2);

    if (currentHealth <= 500)
    {
      return currentHealth;
    }
    else if (currentHealth <= 2000)
    {
      return currentHealth / 2 + 250;
    }
    else
    {
      return currentHealth / 4 + 750;
    }
  }
  getAttackDamageIncrease(damageType: DamageType)
  {
    var attackStat: number, attackFactor: number;

    switch (damageType)
    {
      case DamageType.physical:
      {
        attackStat = this.attributes.attack;
        attackFactor = 0.1;
        break;
      }
      case DamageType.magical:
      {
        attackStat = this.attributes.intelligence;
        attackFactor = 0.1;
        break;
      }
    }

    var troopSize = this.getAdjustedTroopSize() / 4;

    return (1 + attackStat * attackFactor) * troopSize;
  }
  getReducedDamageFactor(damageType: DamageType)
  {
    var defensiveStat: number, defenceFactor: number;
    var finalDamageMultiplier = 1;

    switch (damageType)
    {
      case DamageType.physical:
      {
        defensiveStat = this.attributes.defence;
        defenceFactor = 0.045;

        var guardAmount = Math.min(this.battleStats.guardAmount, 100);
        finalDamageMultiplier = 1 - guardAmount / 200; // 1 - 0.5;
        break;
      }
      case DamageType.magical:
      {
        defensiveStat = this.attributes.intelligence;
        defenceFactor = 0.045;
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

    this.destroyAllItems();
    player.removeUnit(this);
    this.fleet.removeUnit(this);

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
  addGuard(amount: number, coverage: GuardCoverage)
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
  getCounterAttackStrength()
  {
    return 1; // TODO unit
  }
  canActThisTurn(): boolean
  {
    return this.timesActedThisTurn < 1 || this.fleet.player.isIndependent;
  }
  isStealthy(): boolean
  {
    // TODO unit
    return this.template.isStealthy;
  }
  getVisionRange(): number
  {
    // TODO unit
    return this.template.visionRange;
  }
  getDetectionRange(): number
  {
    // TODO unit
    return this.template.detectionRange;
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
    // TODO unit TODO ai
    return this.currentHealth;
  }
  getTotalCost()
  {
    var totalCost = 0;
    totalCost += this.template.buildCost;
    for (var slot in this.items)
    {
      if (this.items[slot])
      {
        totalCost += this.items[slot].template.buildCost;
      }
    }

    return totalCost;
  }
  getTurnsToReachStar(star: Star)
  {
    var currentLocation = this.fleet.location;
    var distance = currentLocation.getDistanceToStar(star);
    if (distance <= this.currentMovePoints)
    {
      if (this.currentMovePoints === 0)
      {
        return 0;
      }
      else
      {
        return distance / this.currentMovePoints;
      }
    }
    distance -= this.currentMovePoints; // current turn
    return distance / this.maxMovePoints; // future turns
  }
  getExperienceToNextLevel()
  {
    return (4 + this.level) * 10;
  }
  addExperience(amount: number)
  {
    this.experienceForCurrentLevel += Math.round(amount);
  }
  canLevelUp()
  {
    return this.experienceForCurrentLevel >= this.getExperienceToNextLevel();
  }
  handleLevelUp()
  {
    this.experienceForCurrentLevel -= this.getExperienceToNextLevel();
    this.level++;
  }
  hasAbility(ability: AbilityBase, allAbilities: AbilityBase[])
  {
    for (var i = 0; i < allAbilities.length; i++)
    {
      if (allAbilities[i].type === ability.type)
      {
        return true;
      }
    }

    return false;
  }
  getLearnableAbilities(allAbilities: AbilityBase[])
  {
    var abilities: AbilityBase[] = [];

    if (!this.template.learnableAbilities) return abilities;

    for (var i = 0; i < this.template.learnableAbilities.length; i++)
    {
      var learnableItem = this.template.learnableAbilities[i];
      if (Array.isArray(learnableItem))
      {
        var hasAbilityFromGroup: boolean = false;
        for (var j = 0; j < learnableItem.length; j++)
        {
          if (this.hasAbility(learnableItem[j], allAbilities))
          {
            hasAbilityFromGroup = true;
            break;
          }
        }

        if (!hasAbilityFromGroup)
        {
          abilities = abilities.concat(learnableItem);
        }
      }
      else if (!this.hasAbility(learnableItem, allAbilities))
      {
        abilities.push(learnableItem);
      }
    }

    return abilities;
  }
  canUpgradeIntoAbility(ability: AbilityBase, allAbilities: AbilityBase[])
  {
    if (ability.onlyAllowExplicitUpgrade)
    {
      if (!this.template.specialAbilityUpgrades || this.template.specialAbilityUpgrades.indexOf(ability) === -1)
      {
        return false;
      }
    }
    if (this.hasAbility(ability, allAbilities))
    {
      return false;
    }

    return true;
  }
  getAbilityUpgradeData()
  {
    var upgradeData:
    {
      [source: string]:
      {
        base: AbilityBase;
        possibleUpgrades: AbilityBase[];
      }
    } = {};

    var allAbilities: AbilityBase[] = this.getAllAbilities();
    allAbilities = allAbilities.concat(this.getAllPassiveSkills());

    var templates = app.moduleData.Templates;

    for (var i = 0; i < allAbilities.length; i++)
    {
      var parentAbility = allAbilities[i];
      if (!parentAbility.canUpgradeInto) continue;

      for (var j = 0; j < parentAbility.canUpgradeInto.length; j++)
      {
        var childAbilityType = parentAbility.canUpgradeInto[j];
        var childAbility: AbilityBase =
          templates.Abilities[childAbilityType] || templates.PassiveSkills[childAbilityType];
        if (!childAbility) throw new Error("Invalid ability upgrade " + childAbilityType);
        if (this.canUpgradeIntoAbility(childAbility, allAbilities))
        {
          if (!upgradeData[parentAbility.type])
          {
            upgradeData[parentAbility.type] =
            {
              base: parentAbility,
              possibleUpgrades: []
            }
          }

          upgradeData[parentAbility.type].possibleUpgrades.push(childAbility);
        }
      }
    }

    var learnable = this.getLearnableAbilities(allAbilities);
    if (learnable.length > 0)
    {
      upgradeData["learnable"] =
      {
        base: null,
        possibleUpgrades: learnable
      }
    }

    return upgradeData;
  }
  upgradeAbility(source: AbilityBase, newAbility: AbilityBase)
  {
    var newAbilityIsPassiveSkill = !newAbility.mainEffect;
    if (source)
    {
      var sourceIsPassiveSkill = !source.mainEffect;
      if (sourceIsPassiveSkill)
      {
        this.passiveSkills.splice(this.passiveSkills.indexOf(source), 1);
      }
      else
      {
        var castedSource = <AbilityTemplate> source;
        this.abilities.splice(this.abilities.indexOf(castedSource), 1);
      }
    }

    if (newAbilityIsPassiveSkill)
    {
      this.passiveSkills.push(newAbility);
    }
    else
    {
      var castedNewAbility = <AbilityTemplate> newAbility;
      this.abilities.push(castedNewAbility);
    }
  }
  drawBattleScene(SFXParams: Templates.SFXParams)
  {
    this.template.unitDrawingFN(this, SFXParams);
  }
  serialize(includeItems: boolean = true, includeFluff: boolean = true): IUnitSaveData
  {
    var itemsSaveData: IUnitItemsSaveData = {};

    if (includeItems)
    {
      for (var slot in this.items)
      {
        if (this.items[slot])
        {
          itemsSaveData[slot] = this.items[slot].serialize();
        }
      }
    }
    var battleStatsSavedData: IUnitBattleStatsSaveData =
    {
      moveDelay: this.battleStats.moveDelay,
      side: this.battleStats.side,
      position: this.battleStats.position,
      currentActionPoints: this.battleStats.currentActionPoints,
      guardAmount: this.battleStats.guardAmount,
      guardCoverage: this.battleStats.guardCoverage,
      captureChance: this.battleStats.captureChance,
      statusEffects: this.battleStats.statusEffects.map(function(statusEffect)
      {
        return statusEffect.clone();
      }),
      queuedAction: !this.battleStats.queuedAction ? null :
      {
        abilityTemplateKey: this.battleStats.queuedAction.ability.type,
        targetId: this.battleStats.queuedAction.targetId,
        turnsPrepared: this.battleStats.queuedAction.turnsPrepared,
        timesInterrupted: this.battleStats.queuedAction.timesInterrupted
      },
      isAnnihilated: this.battleStats.isAnnihilated
    };

    var data: IUnitSaveData =
    {
      templateType: this.template.type,
      id: this.id,
      name: this.name,

      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,

      currentMovePoints: this.currentMovePoints,
      maxMovePoints: this.maxMovePoints,

      timesActedThisTurn: this.timesActedThisTurn,

      baseAttributes: extendObject(this.baseAttributes),
      abilityTemplateTypes: this.abilities.map(function(ability: AbilityTemplate)
      {
        return ability.type;
      }),
      passiveSkillTemplateTypes: this.passiveSkills.map(function(
        passiveSkill: PassiveSkillTemplate)
      {
        return passiveSkill.type;
      }),

      experienceForCurrentLevel: this.experienceForCurrentLevel,
      level: this.level,

      items: itemsSaveData,
      battleStats: battleStatsSavedData
    };


    if (this.fleet)
    {
      data.fleetId = this.fleet.id;
    }

    if (includeFluff)
    {
      data.portraitKey = this.portrait.key;
    }

    return data;
  }
  makeVirtualClone()
  {
    var data = this.serialize(true, false);
    var clone = new Unit(this.template, this.id, data);

    return clone;
  }
}
