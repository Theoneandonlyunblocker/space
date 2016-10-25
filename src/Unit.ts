

import app from "./App"; // TODO global
import idGenerators from "./idGenerators";
import UnitTemplate from "./templateinterfaces/UnitTemplate";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import PortraitTemplate from "./templateinterfaces/PortraitTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import AbilityBase from "./templateinterfaces/AbilityBase";
import SFXParams from "./templateinterfaces/SFXParams";
import UnitPassiveEffect from "./templateinterfaces/UnitPassiveEffect";
import UnitDrawingFunctionData from "./UnitDrawingFunctionData";

import
{
  default as UnitAttributes,
  UnitAttributeAdjustments,
  UnitAttributesObject,
} from "./UnitAttributes";
import
{
  randInt,
  clamp,
  getItemsFromWeightedProbabilities,
} from "./utility";
import Battle from "./Battle";
import Item from "./Item";
import StatusEffect from "./StatusEffect";
import Fleet from "./Fleet";
import Player from "./Player";
import Star from "./Star";
import GuardCoverage from "./GuardCoverage";
import UnitBattleStats from "./UnitBattleStats";
import UnitBattleSide from "./UnitBattleSide";
import AbilityUpgradeData from "./AbilityUpgradeData";
import UnitDisplayData from "./UnitDisplayData";
import UnitItems from "./UnitItems";

import UnitSaveData from "./savedata/UnitSaveData";
import UnitBattleStatsSaveData from "./savedata/UnitBattleStatsSaveData";


export default class Unit
{
  public template: UnitTemplate;

  public id: number;

  public name: string;
  public portrait: PortraitTemplate;
  private race: RaceTemplate;

  public maxHealth: number;
  public currentHealth: number;
  public isSquadron: boolean; // TODO 19.10.2016 | can't we just get this from template?

  public currentMovePoints: number;
  public maxMovePoints: number;

  public timesActedThisTurn: number;

  public baseAttributes: UnitAttributes;
  public attributesAreDirty: boolean = false;
  private cachedAttributes: UnitAttributes;
  public get attributes(): UnitAttributes
  {
    if (this.attributesAreDirty || !this.cachedAttributes)
    {
      this.updateCachedAttributes();
    }

    return this.cachedAttributes;
  }

  public battleStats: UnitBattleStats;
  public drawingFunctionData: UnitDrawingFunctionData;

  private abilities: AbilityTemplate[] = [];
  private passiveSkills: PassiveSkillTemplate[] = [];

  public experienceForCurrentLevel: number;
  public level: number;

  public fleet: Fleet;

  public items: UnitItems;

  private passiveSkillsByPhase:
  {
    atBattleStart?: PassiveSkillTemplate[];
    atTurnStart?: PassiveSkillTemplate[];
    inBattlePrep?: PassiveSkillTemplate[];
  } = {};
  private passiveSkillsByPhaseAreDirty: boolean = true;

  public uiDisplayIsDirty: boolean = true;
  public lastHealthDrawnAt: number;

  constructor(props:
  {
    template: UnitTemplate;

    id: number;
    name: string;

    maxHealth: number;
    currentHealth: number;
    
    attributes: UnitAttributesObject;

    currentMovePoints: number;
    maxMovePoints: number;
    timesActedThisTurn: number;

    abilities: AbilityTemplate[];
    passiveSkills: PassiveSkillTemplate[];

    level: number;
    experienceForCurrentLevel: number;

    battleStats?: UnitBattleStats;

    maxItemSlots: {[slot: string]: number;};
    items: Item[];

    portrait: PortraitTemplate;
    race: RaceTemplate;
  })
  {
    this.template = props.template;
    this.isSquadron = this.template.isSquadron;

    this.id = props.id;
    this.name = props.name;

    this.maxHealth = props.maxHealth;
    this.currentHealth = props.currentHealth;

    this.baseAttributes = new UnitAttributes(props.attributes).clamp(1, 9);
    this.cachedAttributes = this.baseAttributes.clone();

    this.currentMovePoints = props.currentMovePoints;
    this.maxMovePoints = props.maxMovePoints;
    this.timesActedThisTurn = props.timesActedThisTurn;

    this.abilities = props.abilities.slice(0);
    this.passiveSkills = props.passiveSkills.slice(0);

    this.level = props.level;
    this.experienceForCurrentLevel = props.experienceForCurrentLevel;

    if (props.battleStats)
    {
      this.battleStats =
      {
        moveDelay: props.battleStats.moveDelay,
        side: props.battleStats.side,
        position: props.battleStats.position,
        currentActionPoints: props.battleStats.currentActionPoints,
        guardAmount: props.battleStats.guardAmount,
        guardCoverage: props.battleStats.guardCoverage,
        captureChance: props.battleStats.captureChance,
        statusEffects: props.battleStats.statusEffects.map((statusEffect) =>
        {
          return statusEffect.clone();
        }),
        lastHealthBeforeReceivingDamage: this.currentHealth,
        queuedAction: props.battleStats.queuedAction ?
          {
            ability: props.battleStats.queuedAction.ability,
            targetId: props.battleStats.queuedAction.targetId,
            turnsPrepared: props.battleStats.queuedAction.turnsPrepared,
            timesInterrupted: props.battleStats.queuedAction.timesInterrupted
          } :
          null,
        isAnnihilated: props.battleStats.isAnnihilated
      };
    }
    else
    {
      this.resetBattleStats();
    }

    this.items = this.makeUnitItems(props.maxItemSlots);
    props.items.forEach(item =>
    {
      this.items.addItem(item, -999);
    });

    this.race = props.race;
    this.portrait = props.portrait;
  }
  public static fromTemplate(props:
  {
    template: UnitTemplate;
    race: RaceTemplate;

    name?: string;
    
    attributeMultiplier?: number;
    healthMultiplier?: number;
  }): Unit
  {
    const template = props.template;
    const race = props.race;

    const attributeMultiplier = isFinite(props.attributeMultiplier) ? props.attributeMultiplier : 1;
    const healthMultiplier = isFinite(props.healthMultiplier) ? props.healthMultiplier : 1;


    const baseAttributeValue = app.moduleData.ruleSet.units.baseAttributeValue * attributeMultiplier;
    const attributeVariance = app.moduleData.ruleSet.units.attributeVariance;
    const baseHealthValue = app.moduleData.ruleSet.units.baseHealthValue * healthMultiplier;
    const healthVariance = app.moduleData.ruleSet.units.healthVariance;

    const baseHealth = baseHealthValue * template.maxHealth;
    const health = randInt(baseHealth - healthVariance, baseHealth + healthVariance);
    
    const unit = new Unit(
    {
      template: template,
      
      id: idGenerators.unit++,
      name: props.name || race.getUnitName(template),

      maxHealth: health,
      currentHealth: health,

      attributes: Unit.getRandomAttributesFromTemplate(template, baseAttributeValue, attributeVariance),

      currentMovePoints: template.maxMovePoints,
      maxMovePoints: template.maxMovePoints,
      timesActedThisTurn: 0,

      abilities: getItemsFromWeightedProbabilities(template.possibleAbilities),
      passiveSkills: template.possiblePassiveSkills ?
        getItemsFromWeightedProbabilities(template.possiblePassiveSkills) :
        [],

      level: 1,
      experienceForCurrentLevel: 0,

      maxItemSlots: template.itemSlots,
      items: [],

      portrait: race.getUnitPortrait(template, app.moduleData.Templates.Portraits),
      race: race,
    });

    return unit;
  }
  public static fromSaveData(data: UnitSaveData): Unit
  {
    const unit = new Unit(
    {
      template: app.moduleData.Templates.Units[data.templateType],
      
      id: data.id,
      name: data.name,

      maxHealth: data.maxHealth,
      currentHealth: data.currentHealth,

      attributes: data.baseAttributes,

      currentMovePoints: data.currentMovePoints,
      maxMovePoints: data.maxMovePoints,
      timesActedThisTurn: data.timesActedThisTurn,

      abilities: data.abilityTemplateTypes.map(templateType =>
      {
        return app.moduleData.Templates.Abilities[templateType];
      }),
      passiveSkills: data.passiveSkillTemplateTypes.map(templateType =>
      {
        return app.moduleData.Templates.PassiveSkills[templateType];
      }),

      level: data.level,
      experienceForCurrentLevel: data.experienceForCurrentLevel,

      battleStats: data.battleStats,

      maxItemSlots: data.items.maxItemSlots,
      items: data.serializedItems ?
        data.serializedItems.map(itemSaveData =>
        {
          const itemTemplate = app.moduleData.Templates.Items[itemSaveData.templateType]; 
          return new Item(itemTemplate, itemSaveData.id);
        }) :
        [],

      portrait: data.portraitKey ?
        app.moduleData.Templates.Portraits[data.portraitKey] :
        null,
      race: data.raceKey ?
        app.moduleData.Templates.Races[data.raceKey] :
        null,
    });

    return unit;
  }
  private static getRandomValueFromAttributeLevel(
    level: number,
    baseValue: number,
    variance: number,
  ): number
  {
    const baseValueForLevel = baseValue * level;

    return randInt(baseValueForLevel - variance, baseValueForLevel + variance);
  }
  private static getRandomAttributesFromTemplate(
    template: UnitTemplate,
    baseValue: number,
    variance: number,
  ): UnitAttributesObject
  {
    return(
    {
      attack: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.attack, baseValue, variance),
      defence: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.defence, baseValue, variance),
      intelligence: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.intelligence, baseValue, variance),
      speed: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.speed, baseValue, variance),
      maxActionPoints: randInt(3, 5)
    });
  }
  private getBaseMoveDelay()
  {
    return 30 - this.attributes.speed;
  }
  public resetMovePoints()
  {
    this.currentMovePoints = this.maxMovePoints;
  }
  public resetBattleStats(): void
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
  }
  public setBattlePosition(battle: Battle, side: UnitBattleSide, position: number[])
  {
    this.battleStats.side = side;
    this.battleStats.position = position;
  }
  public addMaxHealth(amountToAdd: number): void
  {
    this.maxHealth += Math.max(0, Math.round(amountToAdd));

    if (this.currentHealth > this.maxHealth)
    {
      this.currentHealth = this.maxHealth;
    }

    this.uiDisplayIsDirty = true;
  }
  public addHealth(amountToAdd: number): void
  {
    const newHealth = this.currentHealth + Math.round(amountToAdd);
    this.currentHealth = clamp(newHealth, 0, this.maxHealth);

    if (this.currentHealth <= 0)
    {
      this.battleStats.isAnnihilated = true;
    }

    this.uiDisplayIsDirty = true;
  }
  public removeHealth(amountToRemove: number): void
  {
    this.addHealth(-amountToRemove);
  }
  public removeActionPoints(amount: number)
  {
    this.battleStats.currentActionPoints -= amount;
    if (this.battleStats.currentActionPoints < 0)
    {
      this.battleStats.currentActionPoints = 0;
    }

    this.uiDisplayIsDirty = true;
  }
  public addMoveDelay(amount: number)
  {
    this.battleStats.moveDelay += amount;
  }
  public updateStatusEffects(): void
  {
    for (var i = this.battleStats.statusEffects.length - 1; i >= 0; i--)
    {
      const statusEffect = this.battleStats.statusEffects[i];

      statusEffect.processTurnEnd();
      if (statusEffect.turnsHasBeenActiveFor >= statusEffect.turnsToStayActiveFor)
      {
        this.removeStatusEffect(statusEffect);
      }
    }

    this.uiDisplayIsDirty = true;
  }
  
  public setQueuedAction(ability: AbilityTemplate, target: Unit)
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
  public interruptQueuedAction(interruptStrength: number)
  {
    var action = this.battleStats.queuedAction;
    if (!action)
    {
      return;
    }

    action.timesInterrupted += interruptStrength;
    if (action.timesInterrupted >= action.ability.preparation.interruptsNeeded)
    {
      this.clearQueuedAction();
    }

    this.uiDisplayIsDirty = true;
  }
  public updateQueuedAction()
  {
    var action = this.battleStats.queuedAction;
    if (!action)
    {
      return;
    }

    action.turnsPrepared++;

    this.uiDisplayIsDirty = true;
  }
  public isReadyToUseQueuedAction()
  {
    var action = this.battleStats.queuedAction;

    return (action && action.turnsPrepared >= action.ability.preparation.turnsToPrep);
  }
  public clearQueuedAction()
  {
    this.battleStats.queuedAction = null;
    this.uiDisplayIsDirty = true;
  }
  // TODO gameplay | allow units to become untargetable in battle (cloaking?)
  public isTargetable()
  {
    return this.isActiveInBattle();
  }
  public isActiveInBattle()
  {
    return this.currentHealth > 0 && !this.battleStats.isAnnihilated;
  }

  private makeUnitItems(itemSlots: {[slot: string]: number})
  {
    return new UnitItems(
      itemSlots,
      (item) =>
      {
        item.unit = this;
      },
      (changedItem) =>
      {
        if (changedItem.template.attributeAdjustments)
        {
          this.attributesAreDirty = true;
        }
        if (changedItem.template.passiveSkill)
        {
          this.passiveSkillsByPhaseAreDirty = true;
        }
      }
    );
  }
  // public addItem(item: Item, index: number)
  // {
  //   var itemSlot = item.template.slot;

  //   if (!this.items.hasSlotForItem(item))
  //   {
  //     return false;
  //   }

  //   if (item.unit)
  //   {
  //     item.unit.removeItem(item);
  //   }

  //   this.items.addItem(item, index);
  //   item.unit = this;

    // if (item.template.attributeAdjustments)
    // {
    //   this.attributesAreDirty = true;
    // }
    // if (item.template.passiveSkill)
    // {
    //   this.passiveSkillsByPhaseAreDirty = true;
    // }
  // }
  // public removeItem(item: Item)
  // {
  //   var itemSlot = item.template.slot;

  //   if (!this.items.hasItem(item))
  //   {
  //     return false;
  //   }

  //   this.items.removeItem(item);
  //   item.unit = null;

  //   if (item.template.attributeAdjustments)
  //   {
  //     this.attributesAreDirty = true;
  //   }
  //   if (item.template.passiveSkill)
  //   {
  //     this.passiveSkillsByPhaseAreDirty = true;
  //   }

  //   return true;
  // }
  private getAttributesWithItems()
  {
    return this.baseAttributes.getAdjustedAttributes(this.items.getAttributeAdjustments()).clamp(1, 9);
  }
  public addStatusEffect(statusEffect: StatusEffect)
  {
    if (this.battleStats.statusEffects.indexOf(statusEffect) !== -1)
    {
      throw new Error("Tried to add duplicate status effect to unit " + this.name);
    }
    else if (statusEffect.turnsToStayActiveFor === 0)
    {
      console.warn("Tried to add status effect", statusEffect, "with 0 duration");
      return;
    }

    this.battleStats.statusEffects.push(statusEffect);
    if (statusEffect.template.attributes)
    {
      this.attributesAreDirty = true;
    }

    this.uiDisplayIsDirty = true;
  }
  private removeStatusEffect(statusEffect: StatusEffect)
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

    this.uiDisplayIsDirty = true;
  }
  private getStatusEffectAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    if (!this.battleStats || !this.battleStats.statusEffects)
    {
      return [];
    }

    return this.battleStats.statusEffects.filter(statusEffect =>
    {
      return Boolean(statusEffect.template.attributes);
    }).map(statusEffect =>
    {
      return statusEffect.template.attributes;
    });
  }
  private getAttributesWithItemsAndEffects()
  {
    const itemAdjustments = this.items.getAttributeAdjustments();
    const effectAdjustments = this.getStatusEffectAttributeAdjustments();
    
    return this.baseAttributes.getAdjustedAttributes(...itemAdjustments, ...effectAdjustments);
  }
  private getAttributesWithEffectsDifference(): UnitAttributes
  {
    const withItems = this.getAttributesWithItems();
    const withEffects = this.getAttributesWithItemsAndEffects();

    return withEffects.getDifferenceBetween(withItems);
  }
  private updateCachedAttributes()
  {
    this.cachedAttributes = this.getAttributesWithItemsAndEffects();
    this.attributesAreDirty = false;
  }
  // public removeItemAtSlot(slot: string)
  // {
  //   if (this.items[slot])
  //   {
  //     this.removeItem(this.items[slot]);
  //     return true;
  //   }

  //   return false;
  // }
  public getAllAbilities(): AbilityTemplate[]
  {
    return this.abilities.concat(this.items.getAbilities());
  }
  public getAllPassiveSkills(): PassiveSkillTemplate[]
  {
    var allSkills: PassiveSkillTemplate[] = [];
    
    allSkills = allSkills.concat(this.passiveSkills);
    allSkills = allSkills.concat(this.items.getPassiveSkills());

    return allSkills;
  }
  private updatePassiveSkillsByPhase(): void
  {
    var updatedSkills = {};

    var allSkills = this.getAllPassiveSkills();

    for (let i = 0; i < allSkills.length; i++)
    {
      var skill = allSkills[i];
      ["atBattleStart", "atTurnStart", "inBattlePrep"].forEach(function(phase)
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
  public getPassiveSkillsByPhase()
  {
    if (this.passiveSkillsByPhaseAreDirty)
    {
      this.updatePassiveSkillsByPhase();
    }

    return this.passiveSkillsByPhase;
  }
  private getPassiveEffectsForScene(scene: "galaxyMap" | "battle" | "battlePrep"): UnitPassiveEffect[]
  {
    const relevantTemplateKeys: string[] = [];
    switch (scene)
    {
      case "galaxyMap":
        break;
      case "battlePrep":
        relevantTemplateKeys.push("atBattleStart", "inBattlePrep");
        break;
      case "battle":
        relevantTemplateKeys.push("beforeAbilityUse", "afterAbilityUse");
        break;
    }
    
    const effectFilterFN = (passiveEffect: UnitPassiveEffect) =>
    {
      if (passiveEffect.isHidden)
      {
        return false;
      }
      for (let key of relevantTemplateKeys)
      {
        if (passiveEffect[key])
        {
          return true;
        }
      }
      return false;
    }
    
    const relevantStatusEffectTemplates = this.battleStats.statusEffects.map(statusEffect =>
    {
      return statusEffect.template;
    }).filter(effectFilterFN);
    
    const relevantPassiveEffectTemplates = this.getAllPassiveSkills().filter(effectFilterFN);
    
    return relevantStatusEffectTemplates.concat(relevantPassiveEffectTemplates);
  } 
  public receiveDamage(amount: number)
  {
    this.battleStats.lastHealthBeforeReceivingDamage = this.currentHealth;
    this.addHealth(-amount);
  }
  public addToFleet(fleet: Fleet)
  {
    this.fleet = fleet;
  }
  public removeFromFleet()
  {
    this.fleet = null;
  }
  public removeFromPlayer()
  {
    var player = this.fleet.player;

    this.items.destroyAllItems();
    player.removeUnit(this);
    this.fleet.removeUnit(this);

    app.moduleData.scripts.unit.removeFromPlayer.forEach(scriptFN =>
    {
      scriptFN(this);
    });

    this.uiDisplayIsDirty = true;
  }
  public transferToPlayer(newPlayer: Player)
  {
    var location = this.fleet.location;

    this.removeFromPlayer();

    newPlayer.addUnit(this);
    new Fleet(newPlayer, [this], location);
  }
  public removeGuard(amount: number)
  {
    this.battleStats.guardAmount -= amount;
    if (this.battleStats.guardAmount < 0) this.removeAllGuard();

    this.uiDisplayIsDirty = true;
  }
  public addGuard(amount: number, coverage: GuardCoverage)
  {
    this.battleStats.guardAmount += amount;
    this.battleStats.guardCoverage = coverage;

    this.uiDisplayIsDirty = true;
  }
  public removeAllGuard()
  {
    this.battleStats.guardAmount = 0;
    this.battleStats.guardCoverage = null;

    this.uiDisplayIsDirty = true;
  }
  public getCounterAttackStrength()
  {
    return 1; // TODO unit
  }
  public canActThisTurn(): boolean
  {
    return this.timesActedThisTurn < 1 || this.fleet.player.isIndependent;
  }
  public isStealthy(): boolean
  {
    // TODO unit
    return this.template.isStealthy;
  }
  public getVisionRange(): number
  {
    // TODO unit
    return this.template.visionRange;
  }
  public getDetectionRange(): number
  {
    // TODO unit
    return this.template.detectionRange;
  }
  public getHealingForGameTurnStart(): number
  {
    var location = this.fleet.location;

    var baseHealFactor = 0.05;
    var healingFactor = baseHealFactor + location.getHealingFactor(this.fleet.player);

    var healAmount = this.maxHealth * healingFactor;

    return healAmount;
  }
  public getTotalCost()
  {
    var totalCost = 0;
    totalCost += this.template.buildCost;
    totalCost += this.items.getAllItems().map(item =>
    {
      return item.template.buildCost;
    }).reduce((a, b) =>
    {
      return a + b;
    }, 0);

    return totalCost;
  }
  public getTurnsToReachStar(star: Star)
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
  public getExperienceToNextLevel()
  {
    return (4 + this.level) * 10;
  }
  public addExperience(amount: number)
  {
    this.experienceForCurrentLevel += Math.round(amount);
  }
  public canLevelUp()
  {
    return this.experienceForCurrentLevel >= this.getExperienceToNextLevel();
  }
  public handleLevelUp()
  {
    this.experienceForCurrentLevel -= this.getExperienceToNextLevel();
    this.level++;
  }
  private hasAbility(ability: AbilityBase, allAbilities: AbilityBase[])
  {
    for (let i = 0; i < allAbilities.length; i++)
    {
      if (allAbilities[i].type === ability.type)
      {
        return true;
      }
    }

    return false;
  }
  private getLearnableAbilities(allAbilities: AbilityBase[]): AbilityBase[]
  {
    const abilities: AbilityBase[] = [];

    if (!this.template.learnableAbilities)
    {
      return abilities;
    }

    for (let i = 0; i < this.template.learnableAbilities.length; i++)
    {
      if (Array.isArray(this.template.learnableAbilities[i]))
      {
        const learnableAbilityGroup = <AbilityBase[]> this.template.learnableAbilities[i];
        let hasAbilityFromGroup: boolean = false;
        for (let j = 0; j < learnableAbilityGroup.length; j++)
        {
          if (this.hasAbility(learnableAbilityGroup[j], allAbilities))
          {
            hasAbilityFromGroup = true;
            break;
          }
        }

        if (!hasAbilityFromGroup)
        {
          abilities.push(...learnableAbilityGroup);
        }
      }
      else
      {
        const learnableAbility = <AbilityBase> this.template.learnableAbilities[i];
        if (!this.hasAbility(learnableAbility, allAbilities))
        {
          abilities.push(learnableAbility);
        }
      }
    }

    return abilities;
  }
  private canUpgradeIntoAbility(ability: AbilityBase, allAbilities: AbilityBase[])
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
  public getAbilityUpgradeData(): AbilityUpgradeData
  {
    const upgradeData: AbilityUpgradeData = {};

    const allAbilities: AbilityBase[] = this.getAllAbilities();
    allAbilities.push(...this.getAllPassiveSkills());
    
    const upgradableAbilities: AbilityBase[] = allAbilities.filter(abilityTemplate =>
    {
      return abilityTemplate.canUpgradeInto && abilityTemplate.canUpgradeInto.length > 0;
    });

    upgradableAbilities.forEach(parentAbility =>
    {
      parentAbility.canUpgradeInto.forEach(childAbility =>
      {
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
      });
    });

    const learnable = this.getLearnableAbilities(allAbilities);
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
  public upgradeAbility(source: AbilityBase, newAbility: AbilityBase)
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
  public drawBattleScene(params: SFXParams)
  {
    this.template.unitDrawingFN(this, params);
  }
  public getDisplayData(scene: "galaxyMap" | "battle" | "battlePrep"): UnitDisplayData
  {
    return(
    {
      name: this.name,
      facesLeft: this.battleStats.side === "side2",
      
      currentHealth: this.currentHealth,
      maxHealth: this.maxHealth,
      guardAmount: this.battleStats.guardAmount,
      guardType: this.battleStats.guardCoverage,
      currentActionPoints: this.battleStats.currentActionPoints,
      maxActionPoints: this.attributes.maxActionPoints,
      isPreparing: Boolean(this.battleStats.queuedAction),
      isAnnihilated: this.battleStats.isAnnihilated,
      isSquadron: this.isSquadron,
      
      portraitSrc: this.portrait.imageSrc,
      iconSrc: this.template.icon,
      
      attributeChanges: this.getAttributesWithEffectsDifference().serialize(),
      passiveEffects: this.getPassiveEffectsForScene(scene),
    });
  }
  public serialize(includeItems: boolean = true, includeFluff: boolean = true): UnitSaveData
  {
    var battleStatsSavedData: UnitBattleStatsSaveData =
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
        return statusEffect.serialize();
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

    var data: UnitSaveData =
    {
      templateType: this.template.type,
      id: this.id,
      name: this.name,

      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,

      currentMovePoints: this.currentMovePoints,
      maxMovePoints: this.maxMovePoints,

      timesActedThisTurn: this.timesActedThisTurn,

      baseAttributes: this.baseAttributes.serialize(),
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

      items: this.items.serialize(),
      battleStats: battleStatsSavedData
    };


    if (this.fleet)
    {
      data.fleetId = this.fleet.id;
    }

    if (includeItems)
    {
      data.serializedItems = this.items.serializeItems();
    }

    if (includeFluff)
    {
      data.portraitKey = this.portrait.key;
      data.raceKey = this.race.type;
    }

    return data;
  }
  public makeVirtualClone(): Unit
  {
    const clone = new Unit(
    {
      template: this.template,
      id: this.id,
      name: this.name,
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
      attributes: this.baseAttributes.clone(),
      currentMovePoints: this.currentMovePoints,
      maxMovePoints: this.maxMovePoints,
      timesActedThisTurn: this.timesActedThisTurn,
      abilities: this.abilities,
      passiveSkills: this.passiveSkills,
      level: this.level,
      experienceForCurrentLevel: this.experienceForCurrentLevel,
      
      battleStats: this.battleStats,

      maxItemSlots: this.items.itemSlots,
      items: this.items.items,
      
      portrait: this.portrait,
      race: this.race,
    });

    return clone;
  }
}
