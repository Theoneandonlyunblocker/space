

import {UnitDrawingFunctionData} from "./UnitDrawingFunctionData";
import {activeModuleData} from "../app/activeModuleData";
import {idGenerators} from "../app/idGenerators";
import {AbilityBase} from "../templateinterfaces/AbilityBase";
import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";
import {PassiveSkillTemplate} from "../templateinterfaces/PassiveSkillTemplate";
import {PortraitTemplate} from "../templateinterfaces/PortraitTemplate";
import {RaceTemplate} from "../templateinterfaces/RaceTemplate";
import {VfxParams} from "../templateinterfaces/VfxParams";
import {UnitTemplate} from "../templateinterfaces/UnitTemplate";

import {Fleet} from "../fleets/Fleet";
import {Item} from "../items/Item";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import
{
  UnitAttributeAdjustments,
  UnitAttributes,
  UnitAttributesObject,
} from "./UnitAttributes";
import {UnitBattleSide} from "./UnitBattleSide";
import {UnitBattleStats} from "./UnitBattleStats";
import {UnitDisplayData} from "./UnitDisplayData";
import {UnitItems} from "./UnitItems";
import {UpgradableAbilitiesData} from "../abilities/UpgradableAbilitiesData";
import
{
  clamp,
  getItemsFromProbabilityDistributions,
  getUniqueArrayKeys,
  randInt,
  sumObjectValues,
} from "../generic/utility";

import {UnitSaveData} from "../savedata/UnitSaveData";
import { ProbabilityDistributions } from "../templateinterfaces/ProbabilityDistribution";
import { Name } from "../localization/Name";
import { Resources } from "../player/PlayerResources";
import { UnitModifiersCollection } from "../maplevelmodifiers/UnitModifiersCollection";
import { applyFlatAndMultiplierAdjustments } from "../generic/FlatAndMultiplierAdjustment";
import { TemplateCollection } from "../templateinterfaces/TemplateCollection";


export class Unit
{
  public template: UnitTemplate;

  public id: number;

  public name: Name;
  public portrait?: PortraitTemplate;
  private race?: RaceTemplate;

  public maxHealth: number;
  public currentHealth: number;

  public currentMovePoints: number;
  public maxMovePoints: number;

  public offensiveBattlesFoughtThisTurn: number;

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

  private readonly abilities: AbilityTemplate[] = [];
  private readonly passiveSkills: PassiveSkillTemplate[] = [];

  private readonly learnableAbilities: AbilityBase[] = [];
  private readonly abilityUpgrades: UpgradableAbilitiesData = {};

  public experienceForCurrentLevel: number;
  public level: number;

  public fleet: Fleet;

  public items: UnitItems;

  public uiDisplayIsDirty: boolean = true;
  public lastHealthDrawnAt: number;

  public readonly mapLevelModifiers: UnitModifiersCollection = new UnitModifiersCollection(this);

  private constructor(props:
  {
    template: UnitTemplate;

    id: number;
    name: Name;

    maxHealth: number;
    currentHealth: number;

    attributes: UnitAttributesObject;

    currentMovePoints: number;
    maxMovePoints: number;
    offensiveBattlesFoughtThisTurn: number;

    abilities: AbilityTemplate[];
    passiveSkills: PassiveSkillTemplate[];

    learnableAbilities: AbilityBase[];
    abilityUpgrades: UpgradableAbilitiesData;

    level: number;
    experienceForCurrentLevel: number;

    battleStats?: UnitBattleStats;

    maxItemSlots: {[slot: string]: number};
    items: Item[];

    portrait?: PortraitTemplate;
    race?: RaceTemplate;
  })
  {
    this.template = props.template;

    this.id = props.id;
    this.name = props.name;

    this.maxHealth = props.maxHealth;
    this.currentHealth = props.currentHealth;

    this.baseAttributes = new UnitAttributes(props.attributes).clamp(1, 9);
    this.cachedAttributes = this.baseAttributes.clone();

    this.currentMovePoints = props.currentMovePoints;
    this.maxMovePoints = props.maxMovePoints;
    this.offensiveBattlesFoughtThisTurn = props.offensiveBattlesFoughtThisTurn;

    this.abilities = props.abilities.slice(0);
    this.passiveSkills = props.passiveSkills.slice(0);

    this.learnableAbilities = props.learnableAbilities;
    this.abilityUpgrades = props.abilityUpgrades;

    this.level = props.level;
    this.experienceForCurrentLevel = props.experienceForCurrentLevel;

    if (props.battleStats)
    {
      this.battleStats = props.battleStats;
    }
    else
    {
      this.battleStats = UnitBattleStats.createInitialBattleStatsForUnit(this);
    }

    this.items = this.makeUnitItems(props.maxItemSlots);
    props.items.forEach(item =>
    {
      if (item.positionInUnit !== undefined)
      {
        this.items.addItemAtPosition(item, item.positionInUnit);
      }
      else
      {
        this.items.addItem(item);
      }
    });

    this.race = props.race;
    this.portrait = props.portrait;
  }
  public static fromTemplate(props:
  {
    template: UnitTemplate;
    race: RaceTemplate;

    name?: Name;

    attributeMultiplier?: number;
    healthMultiplier?: number;
  }): Unit
  {
    const template = props.template;
    const race = props.race;

    const attributeMultiplier = props.attributeMultiplier !== undefined ? props.attributeMultiplier : 1;
    const healthMultiplier = props.healthMultiplier !== undefined ? props.healthMultiplier : 1;

    const baseAttributeValue = activeModuleData.ruleSet.units.baseAttributeValue * attributeMultiplier;
    const attributeVariance = activeModuleData.ruleSet.units.attributeVariance;
    const baseHealthValue = activeModuleData.ruleSet.units.baseHealthValue * healthMultiplier;
    const healthVariance = activeModuleData.ruleSet.units.healthVariance;

    const baseHealth = baseHealthValue * template.maxHealthLevel;
    const health = randInt(baseHealth - healthVariance, baseHealth + healthVariance);

    const abilities = getItemsFromProbabilityDistributions(template.possibleAbilities);
    const passiveSkills = template.possiblePassiveSkills ?
      getItemsFromProbabilityDistributions(template.possiblePassiveSkills) :
      [];
    const learnableAbilities = template.possibleLearnableAbilities ?
      getItemsFromProbabilityDistributions(template.possibleLearnableAbilities) :
      [];

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

      offensiveBattlesFoughtThisTurn: 0,

      abilities: abilities,
      passiveSkills: passiveSkills,

      learnableAbilities: learnableAbilities,
      abilityUpgrades: Unit.getUpgradableAbilitiesData(
        template,
        [...abilities, ...passiveSkills, ...learnableAbilities]
      ),

      level: 1,
      experienceForCurrentLevel: 0,

      maxItemSlots: template.itemSlots,
      items: [],

      portrait: race.getUnitPortrait(template, activeModuleData.templates.portraits),
      race: race,
    });

    return unit;
  }
  public static fromSaveData(data: UnitSaveData): Unit
  {
    function fetchTemplate<T>(
      templates: TemplateCollection<T>,
      key: keyof typeof templates,
      templatesCategoryDisplayString: string,
    ): T
    {
      const template = templates[key];
      if (!template)
      {
        throw new Error(`Missing ${templatesCategoryDisplayString} template '${key}'`);
      }

      return template;
    }

    const unit = new Unit(
    {
      template: fetchTemplate(activeModuleData.templatesByImplementation.unitLike, data.templateType, "unit"),

      id: data.id,
      name: Name.fromData(data.name),

      maxHealth: data.maxHealth,
      currentHealth: data.currentHealth,

      attributes: data.baseAttributes,

      currentMovePoints: data.currentMovePoints,
      maxMovePoints: data.maxMovePoints,
      offensiveBattlesFoughtThisTurn: data.offensiveBattlesFoughtThisTurn,

      abilities: data.abilityTypes.map(templateType =>
      {
        return fetchTemplate(activeModuleData.templates.abilities, templateType, "ability");
      }),
      passiveSkills: data.passiveSkillTypes.map(templateType =>
      {
        return fetchTemplate(activeModuleData.templates.passiveSkills, templateType, "passive skill");
      }),
      abilityUpgrades: data.abilityUpgrades.reduce((allUpgradeData, currentUpgradeData) =>
      {
        const allAbilitiesAndPassiveSkills =
        {
          ...activeModuleData.templates.abilities,
          ...activeModuleData.templates.passiveSkills,
        };
        const source = allAbilitiesAndPassiveSkills[currentUpgradeData.source];
        const upgrades = currentUpgradeData.possibleUpgrades.map(templateType =>
        {
          return fetchTemplate(allAbilitiesAndPassiveSkills, templateType, "ability / passive skill");
        });

        allUpgradeData[source.type] =
        {
          source: source,
          possibleUpgrades: upgrades,
        };

        return allUpgradeData;
      }, {}),
      learnableAbilities: data.learnableAbilities.map(templateType =>
      {
        const allAbilitiesAndPassiveSkills =
        {
          ...activeModuleData.templates.abilities,
          ...activeModuleData.templates.passiveSkills,
        };

        return allAbilitiesAndPassiveSkills[templateType];
      }),

      level: data.level,
      experienceForCurrentLevel: data.experienceForCurrentLevel,

      battleStats: UnitBattleStats.fromData(data.battleStats),

      maxItemSlots: data.items.maxItemSlots,
      items: [],

      portrait: data.portraitKey ?
        activeModuleData.templates.portraits[data.portraitKey] :
        undefined,
      race: data.raceKey ?
        activeModuleData.templates.races[data.raceKey] :
        undefined,
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
      maxActionPoints: randInt(
        activeModuleData.ruleSet.units.minActionPoints,
        activeModuleData.ruleSet.units.maxActionPoints,
      ),
    });
  }

  public resetMovePoints()
  {
    this.currentMovePoints = this.maxMovePoints;
  }
  public resetBattleStats(): void
  {
    this.battleStats = UnitBattleStats.createInitialBattleStatsForUnit(this);

    this.attributesAreDirty = true;
    this.uiDisplayIsDirty = true;
  }
  public setBattlePosition(side: UnitBattleSide, position: number[])
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
  public setQueuedAction(ability: AbilityTemplate, target: Unit)
  {
    this.battleStats.queuedAction =
    {
      ability: ability,
      targetId: target.id,
      turnsPrepared: 0,
      timesInterrupted: 0,
    };

    this.uiDisplayIsDirty = true;
  }
  public interruptQueuedAction(interruptStrength: number)
  {
    const action = this.battleStats.queuedAction;
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
    const action = this.battleStats.queuedAction;
    if (!action)
    {
      return;
    }

    action.turnsPrepared++;

    this.uiDisplayIsDirty = true;
  }
  public isReadyToUseQueuedAction()
  {
    const action = this.battleStats.queuedAction;

    return (action && action.turnsPrepared >= action.ability.preparation.turnsToPrep);
  }
  public clearQueuedAction()
  {
    this.battleStats.queuedAction = null;
    this.uiDisplayIsDirty = true;
  }
  public isTargetable(): boolean
  {
    return this.isActiveInBattle();
  }
  public isActiveInBattle(): boolean
  {
    return !this.battleStats.isAnnihilated;
  }
  public canAct(): boolean
  {
    return this.isActiveInBattle() && this.battleStats.currentActionPoints > 0;
  }

  private makeUnitItems(itemSlots: {[slot: string]: number})
  {
    return new UnitItems(
    {
      itemSlots: itemSlots,
      onAdd: item =>
      {
        item.unit = this;
        item.modifiers.setModifiersForUnit();
      },
      onRemove: item =>
      {
        item.modifiers.clearModifiersForUnit();

        item.unit = undefined;
        item.positionInUnit = undefined;
      },
      onUpdate: changedItem =>
      {
        if (changedItem.template.attributeAdjustments)
        {
          this.attributesAreDirty = true;
        }
      },
    });
  }
  // TODO 2020.02.08 | rename (or rework?)
  private getStatusEffectAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    if (!this.battleStats || !this.battleStats.combatEffects)
    {
      return [];
    }

    return this.battleStats.combatEffects.getAttributeAdjustments();
  }
  private getAttributesWithItems()
  {
    return this.baseAttributes.getAdjustedAttributes(...this.items.getAttributeAdjustments()).clamp(1, 9);
  }
  private getAttributesWithItemsAndEffects()
  {
    const attributesWithItems = this.getAttributesWithItems();
    const effectAdjustments = this.getStatusEffectAttributeAdjustments();

    return attributesWithItems.getAdjustedAttributes(...effectAdjustments);
  }
  private getAttributesWithEffectsDifference(): UnitAttributes
  {
    const attributesWithItems = this.getAttributesWithItems();
    const attributesWithEffects = this.getAttributesWithItemsAndEffects();

    return attributesWithEffects.getDifferenceBetween(attributesWithItems);
  }
  private updateCachedAttributes()
  {
    this.cachedAttributes = this.getAttributesWithItemsAndEffects();
    this.attributesAreDirty = false;
  }
  public getAllAbilities(): AbilityTemplate[]
  {
    const allAbilities = [...this.abilities, ...this.items.getAbilities()];

    const allUniqueAbilities = getUniqueArrayKeys(allAbilities, template => template.type);

    return allUniqueAbilities;
  }
  public getAllPassiveSkills(): PassiveSkillTemplate[]
  {
    const allPassiveSkills = [...this.passiveSkills, ...this.items.getPassiveSkills()];

    const allUniquePassiveSkills = getUniqueArrayKeys(allPassiveSkills, template => template.type);

    return allUniquePassiveSkills;
  }
  public receiveDamage(amount: number)
  {
    this.battleStats.lastHealthBeforeReceivingDamage = this.currentHealth;
    this.addHealth(-amount);
  }
  private removeFromPlayer()
  {
    const fleet = this.fleet;
    const player = fleet.player;

    this.items.destroyAllItems();
    player.removeUnit(this);

    fleet.removeUnit(this);
    if (fleet.units.length <= 0)
    {
      fleet.deleteFleet();
    }

    activeModuleData.scripts.call("onUnitRemovedFromPlayer", this);

    this.uiDisplayIsDirty = true;
  }
  public die(): void
  {
    this.mapLevelModifiers.handleDestroy();
    this.removeFromPlayer();
  }
  public transferToPlayer(newPlayer: Player)
  {
    const location = this.fleet.location;

    this.mapLevelModifiers.clearModifiersForOwner();

    this.removeFromPlayer();

    newPlayer.addUnit(this);

    const fleet = Fleet.createFleet(
    {
      units: [this],
      player: newPlayer,
    });
    newPlayer.addFleet(fleet);
    location.addFleet(fleet);

    this.mapLevelModifiers.setModifiersForOwner();
  }
  public getCounterAttackStrength()
  {
    return 1;
  }
  public getMaxOffensiveBattlesPerTurn(): number
  {
    return this.template.maxOffensiveBattlesPerTurn;
  }
  public canFightOffensiveBattle(): boolean
  {
    return this.offensiveBattlesFoughtThisTurn < this.getMaxOffensiveBattlesPerTurn();
  }
  public isStealthy(): boolean
  {
    return Boolean(this.template.isStealthy);
  }
  public getVisionRange(): number
  {
    const baseRange = this.template.visionRange;
    const adjustment = this.mapLevelModifiers.getSelfModifiers().adjustments.vision;

    return applyFlatAndMultiplierAdjustments(baseRange, adjustment);
  }
  public getDetectionRange(): number
  {
    const baseRange = this.template.detectionRange;
    const adjustment = this.mapLevelModifiers.getSelfModifiers().adjustments.detection;

    return applyFlatAndMultiplierAdjustments(baseRange, adjustment);
  }
  public getHealingForGameTurnStart(): number
  {
    const location = this.fleet.location;

    const baseHealFactor = 0.05;
    const healingFactor = baseHealFactor + location.getHealingFactor(this.fleet.player);

    const healAmount = this.maxHealth * healingFactor;

    return healAmount;
  }
  public getTotalCost(): Resources
  {
    const selfCost = this.template.buildCost;
    const allItemCosts = this.items.getAllItems().map(item => item.template.buildCost);

    return sumObjectValues(selfCost, ...allItemCosts);
  }
  public getTurnsToReachStar(star: Star)
  {
    const currentLocation = this.fleet.location;
    let distance = currentLocation.getDistanceToStar(star);
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
    this.mapLevelModifiers.handleUpgrade();
  }
  public getCurrentLearnableAbilities(): AbilityBase[]
  {
    const currentlyKnownAbilities = [...this.abilities, ...this.passiveSkills];

    const unknownLearnableAbilities = this.learnableAbilities.filter(ability =>
    {
      return currentlyKnownAbilities.indexOf(ability) === -1;
    });

    return unknownLearnableAbilities;
  }
  public getCurrentUpgradableAbilitiesData(): UpgradableAbilitiesData
  {
    const upgradeDataForCurrentAbilities: UpgradableAbilitiesData = {};
    [...this.abilities, ...this.passiveSkills].forEach(ability =>
    {
      if (this.abilityUpgrades[ability.type])
      {
        upgradeDataForCurrentAbilities[ability.type] = this.abilityUpgrades[ability.type];
      }
    });

    return upgradeDataForCurrentAbilities;
  }

  private static getUpgradableAbilitiesData(
    template: UnitTemplate,
    upgradeCandidates: AbilityBase[],
    fullUpgradeData: UpgradableAbilitiesData = {},
  ): UpgradableAbilitiesData
  {
    if (upgradeCandidates.length === 0)
    {
      return fullUpgradeData;
    }

    const newUpgradeCandidates: AbilityBase[] = [];

    upgradeCandidates.forEach(sourceAbility =>
    {
      let probabilityDistributions: ProbabilityDistributions<AbilityBase>;
      if (template.possibleAbilityUpgrades && template.possibleAbilityUpgrades[sourceAbility.type])
      {
        probabilityDistributions = template.possibleAbilityUpgrades[sourceAbility.type](sourceAbility);
      }
      else if (sourceAbility.defaultUpgrades)
      {
        probabilityDistributions = sourceAbility.defaultUpgrades;
      }
      else
      {
        probabilityDistributions = [];
      }

      const chosenUpgrades = getItemsFromProbabilityDistributions(probabilityDistributions);

      if (chosenUpgrades.length !== 0)
      {
        if (!fullUpgradeData[sourceAbility.type])
        {
          fullUpgradeData[sourceAbility.type] =
          {
            source: sourceAbility,
            possibleUpgrades: [],
          };
        }
      }

      chosenUpgrades.forEach(abilityToUpgradeInto =>
      {
        fullUpgradeData[sourceAbility.type].possibleUpgrades.push(abilityToUpgradeInto);

        if (!fullUpgradeData[abilityToUpgradeInto.type])
        {
          newUpgradeCandidates.push(abilityToUpgradeInto);
        }
      });
    });

    return Unit.getUpgradableAbilitiesData(template, newUpgradeCandidates, fullUpgradeData);
  }

  public upgradeAttribute(attribute: keyof UnitAttributesObject, amountToIncrease: number): void
  {
    this.baseAttributes[attribute] += amountToIncrease;
    this.attributesAreDirty = true;
  }
  public upgradeAbility(source: AbilityBase, newAbility: AbilityBase): void
  {
    const sourceIsPassiveSkill = !source.mainEffect;

    if (sourceIsPassiveSkill)
    {
      this.passiveSkills.splice(this.passiveSkills.indexOf(source), 1);
    }
    else
    {
      this.abilities.splice(this.abilities.indexOf(<AbilityTemplate> source), 1);
    }

    this.addAbility(newAbility);
  }
  public learnAbility(newAbility: AbilityBase): void
  {
    this.addAbility(newAbility);
  }
  private addAbility(newAbility: AbilityBase): void
  {
    const newAbilityIsPassiveSkill = !newAbility.mainEffect;

    if (newAbilityIsPassiveSkill)
    {
      this.passiveSkills.push(newAbility);
    }
    else
    {
      this.abilities.push(<AbilityTemplate> newAbility);
    }
  }
  public drawBattleScene(params: VfxParams)
  {
    const data = this.template.unitDrawingFN(this, params);
    this.drawingFunctionData = data;
  }
  public getDisplayData(scene: "galaxyMap" | "battle" | "battlePrep"): UnitDisplayData
  {
    return(
    {
      name: this.name.toString(),
      facesLeft: this.battleStats.side === "side2",

      currentHealth: this.currentHealth,
      maxHealth: this.maxHealth,
      guardAmount: this.battleStats.guardAmount,
      guardType: this.battleStats.guardCoverage,
      currentActionPoints: this.battleStats.currentActionPoints,
      maxActionPoints: this.attributes.maxActionPoints,
      isPreparing: Boolean(this.battleStats.queuedAction),
      isAnnihilated: this.battleStats.isAnnihilated,
      isSquadron: this.template.isSquadron,

      portraitSrc: this.portrait.getImageSrc(),
      iconSrc: this.template.getIconSrc(),

      attributeChanges: this.getAttributesWithEffectsDifference().serialize(),
      // TODO 2020.02.08 | old combat stuff
      // passiveEffects: this.getPassiveEffectsForScene(scene),
    });
  }
  public serialize(): UnitSaveData
  {
    const data: UnitSaveData =
    {
      templateType: this.template.type,
      id: this.id,
      name: this.name,

      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,

      currentMovePoints: this.currentMovePoints,
      maxMovePoints: this.maxMovePoints,

      offensiveBattlesFoughtThisTurn: this.offensiveBattlesFoughtThisTurn,

      baseAttributes: this.baseAttributes.serialize(),
      abilityTypes: this.abilities.map(abilityTemplate => abilityTemplate.type),
      passiveSkillTypes: this.passiveSkills.map(passiveSkillTemplate => passiveSkillTemplate.type),

      abilityUpgrades: Object.keys(this.abilityUpgrades).map(sourceAbilityType =>
      {
        return (
        {
          source: sourceAbilityType,
          possibleUpgrades: this.abilityUpgrades[sourceAbilityType].possibleUpgrades.map(ability =>
          {
            return ability.type;
          }),
        });
      }),
      learnableAbilities: this.learnableAbilities.map(abilityTemplate => abilityTemplate.type),

      experienceForCurrentLevel: this.experienceForCurrentLevel,
      level: this.level,

      items: this.items.serialize(),
      battleStats: this.battleStats.serialize(),

      portraitKey: this.portrait.key,
      raceKey: this.race.type,
    };

    if (this.fleet)
    {
      data.fleetId = this.fleet.id;
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
      offensiveBattlesFoughtThisTurn: this.offensiveBattlesFoughtThisTurn,
      abilities: this.abilities,
      passiveSkills: this.passiveSkills,
      abilityUpgrades: this.abilityUpgrades,
      learnableAbilities: this.learnableAbilities,
      level: this.level,
      experienceForCurrentLevel: this.experienceForCurrentLevel,

      battleStats: this.battleStats.clone(),

      maxItemSlots: this.items.itemSlots,
      items: this.items.items,

      portrait: this.portrait,
      race: this.race,
    });

    return clone;
  }
}
