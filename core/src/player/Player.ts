import {AiController} from "../ai/AiController";
import {app} from "../app/App"; // TODO global
import {BattleData} from "../battle/BattleData";
import {BattlePrep} from "../battleprep/BattlePrep";
import {BattleSimulator} from "../ai/BattleSimulator";
import {Color} from "../color/Color";
import {Flag} from "../flag/Flag";
import {Fleet} from "../fleets/Fleet";
import {FleetAttackTarget} from "../map/FleetAttackTarget";
import {Game} from "../game/Game";
import {Item} from "../items/Item";
import {Manufactory} from "../production/Manufactory";
import {Name} from "../localization/Name";
import {options} from "../app/Options";
import {PlayerDiplomacy} from "../diplomacy/PlayerDiplomacy";
import {PlayerTechnology} from "./PlayerTechnology";
import {Point} from "../math/Point";
import {Star} from "../map/Star";
import {Unit} from "../unit/Unit";
import {ValuesByStar} from "../map/ValuesByStar";
import {activeModuleData} from "../app/activeModuleData";
import
{
  generateColorScheme,
  generateSecondaryColor,
} from "../color/colorGeneration";
import {eventManager} from "../app/eventManager";
import {idGenerators} from "../app/idGenerators";
import
{
  extendObject,
  makeRandomPersonality,
} from "../generic/utility";

import {PlayerNotificationSubscriber} from "../notifications/PlayerNotificationSubscriber";

import {RaceTemplate} from "../templateinterfaces/RaceTemplate";
import {TechRequirement} from "../templateinterfaces/TechRequirement";

import {PlayerSaveData} from "../savedata/PlayerSaveData";
import {PlayerTechnologySaveData} from "../savedata/PlayerTechnologySaveData";
import { BuildingTemplate } from "../templateinterfaces/BuildingTemplate";
import { Building } from "../building/Building";
import {BuildingUpgradeData} from "../building/BuildingUpgradeData";
import { Resources } from "./PlayerResources";


const resourcesProxyHandler: ProxyHandler<Resources> =
{
  get: (obj, prop: string) =>
  {
    if (prop in obj)
    {
      return obj[prop];
    }
    else
    {
      return 0;
    }
  },
};
const humanPlayerResourcesProxyHandler: ProxyHandler<Resources> =
{
  ...resourcesProxyHandler,
  set: (obj, prop: string, value) =>
  {
    obj[prop] = value;

    if (prop === "money")
    {
      // TODO 2019.09.27 | this aint good. used in lots of places though
      eventManager.dispatchEvent("playerMoneyUpdated");
    }

    return true;
  }
};


// TODO 2017.07.26 | probably should split minor & major players into subclasses
export class Player
{
  id: number;
  name: Name;
  color: Color;
  colorAlpha: number;
  secondaryColor: Color;
  flag: Flag;
  race: RaceTemplate;
  units: Unit[] = [];
  public resources: Resources;
  fleets: Fleet[] = [];
  items: Item[] = [];

  public isAi: boolean = false;
  public aiController: AiController<any>;
  public isIndependent: boolean = false;
  public isDead: boolean = false;

  public diplomacy: PlayerDiplomacy;

  public notificationLog: PlayerNotificationSubscriber;

  controlledLocations: Star[] = [];

  visionIsDirty: boolean = true;
  visibleStars:
  {
    [id: number]: Star;
  } = {};
  revealedStars:
  {
    [id: number]: Star;
  } = {};
  detectedStars:
  {
    [id: number]: Star;
  } = {};
  identifiedUnits:
  {
    [id: number]: Unit;
  } = {};

  tempOverflowedResearchAmount: number = 0;
  playerTechnology: PlayerTechnology;

  private listeners:
  {
    [key: string]: (...args: any[]) => void;
  } = {};

  constructor(props:
  {
    isAi: boolean;
    isIndependent: boolean;
    isDead?: boolean;

    race: RaceTemplate;

    id?: number;
    name?: Name;

    color?:
    {
      main: Color;
      secondary?: Color;
      alpha?: number;
    };

    flag?: Flag;

    resources: Resources;
    technologyData?: PlayerTechnologySaveData;
  })
  {
    this.isAi = props.isAi;
    this.isIndependent = props.isIndependent;
    this.isDead = props.isDead || false;

    this.race = props.race;

    this.id = isFinite(props.id) ? props.id : idGenerators.player++;
    this.resources = new Proxy({}, this.isAi ? resourcesProxyHandler : humanPlayerResourcesProxyHandler);

    if (props.color)
    {
      this.color = props.color.main;
      this.secondaryColor = props.color.secondary || generateSecondaryColor(this.color);
      this.colorAlpha = isFinite(props.color.alpha) ? props.color.alpha : 1;
    }
    else
    {
      const colorScheme = generateColorScheme();
      this.color = colorScheme.main;
      this.secondaryColor = colorScheme.secondary;
      this.colorAlpha = 1;
    }

    if (props.flag)
    {
      this.flag = props.flag;
    }
    else
    {
      this.flag = this.makeRandomFlag();
    }

    // TODO 2019.09.26 | replace with object spread once getters are removed
    for (const key in props.resources)
    {
      this.resources[key] = props.resources[key];
    }

    if (!this.isIndependent)
    {
      if (this.race.isNotPlayable)
      {
        console.warn(`Race ${this.race.displayName} is marked as unplayable, but was assigned to player ${this.name}`);
      }

      this.initTechnologies(props.technologyData);
    }

    if (props.name)
    {
      this.name = props.name;
    }
    else
    {
      this.name = this.race.getPlayerName(this);
    }
  }
  public static createDummyPlayer(): Player
  {
    return new Player(
    {
      isAi: false,
      isIndependent: false,
      id: -9999,
      name: null,

      race:
      {
        type: null,
        displayName: null,
        description: null,

        technologies: [],
        distributionData:
        {
          weight: 0,
          distributionGroups: [],
        },

        getBuildableBuildings: undefined,
        getBuildableUnits: undefined,
        getBuildableItems: undefined,
        getFleetName: undefined,
        getPlayerName: undefined,
        getUnitName: undefined,
        getUnitPortrait: undefined,
        generateIndependentPlayer: undefined,
        generateIndependentFleets: undefined,

        getAiTemplateConstructor: undefined,
      },
      resources: {money: 0},
    });
  }
  public destroy(): void
  {
    if (this.diplomacy)
    {
      this.diplomacy.destroy();
      this.diplomacy = null;
    }

    this.aiController = null;

    for (const key in this.listeners)
    {
      eventManager.removeEventListener(key, this.listeners[key]);
    }
  }
  public shouldDie(): boolean
  {
    return this.controlledLocations.length === 0;
  }
  private die(): void
  {
    this.isDead = true;

    for (let i = this.fleets.length - 1; i >= 0; i--)
    {
      this.fleets[i].deleteFleet(false);
    }

    activeModuleData.scripts.player.onDeath.forEach(script =>
    {
      script(this);
    });
  }
  initTechnologies(savedData?: PlayerTechnologySaveData): void
  {
    const race = this.race;
    this.playerTechnology = new PlayerTechnology(this.getResearchSpeed.bind(this),
      race.technologies, savedData);

    this.listeners["builtBuildingWithEffect_research"] = eventManager.addEventListener(
      "builtBuildingWithEffect_research",
      this.playerTechnology.capTechnologyPrioritiesToMaxNeeded.bind(this.playerTechnology),
    );
  }
  makeRandomFlag(seed?: any): Flag
  {
    if (!this.color || !this.secondaryColor)
    {
      throw new Error("Player has no color specified");
    }

    const flag = new Flag(this.color);
    flag.addRandomEmblem(this.secondaryColor, seed);

    return flag;
  }
  public makeRandomAiController(game: Game): AiController<any>
  {
    const race = this.race;
    const templateConstructor = race.getAiTemplateConstructor(this);
    const template = templateConstructor.construct(
    {
      player: this,
      game: game,
      personality: makeRandomPersonality(),
    });

    return new AiController(template);
  }
  addUnit(unit: Unit): void
  {
    this.units.push(unit);
    this.identifyUnit(unit);
  }
  removeUnit(toRemove: Unit): void
  {
    const index = this.units.indexOf(toRemove);
    this.units.splice(index, 1);
  }
  getFleetIndex(fleet: Fleet): number
  {
    return this.fleets.indexOf(fleet);
  }
  addFleet(fleet: Fleet): void
  {
    if (this.getFleetIndex(fleet) >= 0)
    {
      return;
    }

    this.fleets.push(fleet);
    this.visionIsDirty = true;
  }
  removeFleet(fleet: Fleet): void
  {
    const fleetIndex = this.getFleetIndex(fleet);

    if (fleetIndex < 0)
    {
      return;
    }

    this.fleets.splice(fleetIndex, 1);
    this.visionIsDirty = true;
  }
  getFleetsWithPositions(): {position: Point; data: Fleet}[]
  {
    const positions:
    {
      position: Point;
      data: Fleet;
    }[] = [];

    for (let i = 0; i < this.fleets.length; i++)
    {
      const fleet = this.fleets[i];

      positions.push(
      {
        position: fleet.location,
        data: fleet,
      });
    }

    return positions;
  }

  hasStar(star: Star): boolean
  {
    return (this.controlledLocations.indexOf(star) >= 0);
  }
  addStar(star: Star): void
  {
    if (this.hasStar(star))
    {
      throw new Error(`Player ${this.name} already has star ${star.name}`);
    }

    star.owner = this;
    this.controlledLocations.push(star);
    this.visionIsDirty = true;
  }
  removeStar(star: Star): void
  {
    const index = this.controlledLocations.indexOf(star);

    if (index < 0)
    {
      throw new Error(`Player ${this.name} doesn't have star ${star.name}`);
    }

    star.owner = null;
    this.controlledLocations.splice(index, 1);
    this.visionIsDirty = true;
    if (this.shouldDie())
    {
      this.die();
    }
  }
  public addResources(toAdd: Resources): void
  {
    for (const key in toAdd)
    {
      this.resources[key] += toAdd[key];
    }
  }
  public removeResources(toRemove: Resources): void
  {
    for (const key in toRemove)
    {
      if (this.resources[key] < toRemove[key])
      {
        throw new Error(`Tried to remove ${toRemove[key]} resources of type '${key}' when player ${this.name.toString()} only had ${this.resources[key]}`);
      }

      this.resources[key] -= toRemove[key];
    }
  }
  public getMissingResourcesFor(resources: Resources): Resources
  {
    return Object.keys(resources).reduce((missingResources, resource) =>
    {
      const amountOwned = this.resources[resource];
      const amountNeeded = resources[resource];
      if (amountOwned < amountNeeded)
      {
        missingResources[resource] = amountNeeded - amountOwned;
      }

      return missingResources;
    }, {});
  }
  public canAfford(resources: Resources): boolean
  {
    for (const key in resources)
    {
      if (this.resources[key] < resources[key])
      {
        return false;
      }
    }

    return true;
  }
  public getResourceIncome(): Resources
  {
    return this.controlledLocations.reduce((total, star) =>
    {
      const moneyIncome = star.getIncome();
      const otherIncome = star.getResourceIncome();

      total.money += moneyIncome;
      if (otherIncome)
      {
        const resourceKey = otherIncome.resource.type;
        if (!total[resourceKey])
        {
          total[resourceKey] = 0;
        }

        total[resourceKey] += otherIncome.amount;
      }

      return total;
    }, {money: 0});
  }
  // TODO refactor | should probably be moved
  public getNeighboringStars(): Star[]
  {
    const stars:
    {
      [id: number]: Star;
    } = {};

    for (let i = 0; i < this.controlledLocations.length; i++)
    {
      const currentOwned = this.controlledLocations[i];
      const frontier =  currentOwned.getLinkedInRange(1).all;
      for (let j = 0; j < frontier.length; j++)
      {
        if (stars[frontier[j].id])
        {
          continue;
        }
        else if (frontier[j].owner.id === this.id)
        {
          continue;
        }
        else
        {
          stars[frontier[j].id] = frontier[j];
        }
      }
    }

    const allStars: Star[] = [];

    for (const id in stars)
    {
      allStars.push(stars[id]);
    }

    return allStars;
  }
  // TODO refactor | should probably be moved
  public getNeighboringPlayers(): Player[]
  {
    const alreadyAddedPlayersById:
    {
      [playerId: number]: Player;
    } = {};

    const neighboringStars = this.getNeighboringStars();

    neighboringStars.forEach(star =>
    {
      alreadyAddedPlayersById[star.owner.id] = star.owner;
    });

    return Object.keys(alreadyAddedPlayersById).map(playerId =>
    {
      return alreadyAddedPlayersById[playerId];
    });
  }
  updateVisionInStar(star: Star): void
  {
    // meet players
    if (this.diplomacy && this.diplomacy.hasAnUnmetPlayer())
    {
      this.meetPlayersInStarByVisibility(star, "visible");
    }
  }
  updateDetectionInStar(star: Star): void
  {
    // meet players
    if (this.diplomacy && this.diplomacy.hasAnUnmetPlayer())
    {
      this.meetPlayersInStarByVisibility(star, "stealthy");
    }
    // identify units
    const unitsToIdentify = star.getUnits();
    for (let i = 0; i < unitsToIdentify.length; i++)
    {
      this.identifyUnit(unitsToIdentify[i]);
    }
  }
  updateAllVisibilityInStar(star: Star): void
  {
    if (this.starIsVisible(star))
    {
      this.updateVisionInStar(star);
    }
    if (this.starIsDetected(star))
    {
      this.updateDetectionInStar(star);
    }
  }
  meetPlayersInStarByVisibility(star: Star, visibility: string): void
  {
    const presentPlayersByVisibility = star.getPresentPlayersByVisibility();

    for (const playerId in presentPlayersByVisibility[visibility])
    {
      const player = presentPlayersByVisibility[visibility][playerId];
      this.diplomacy.meetPlayerIfNeeded(player);
    }
  }
  updateVisibleStars(): void
  {
    const previousVisibleStars = extendObject(this.visibleStars);
    const previousDetectedStars = extendObject(this.detectedStars);
    const newVisibleStars: Star[] = [];
    const newDetectedStars: Star[] = [];
    let visibilityHasChanged: boolean = false;
    let detectionHasChanged: boolean = false;
    this.visibleStars = {};
    this.detectedStars = {};

    let allVisible: Star[] = [];
    let allDetected: Star[] = [];
    for (let i = 0; i < this.controlledLocations.length; i++)
    {
      allVisible = allVisible.concat(this.controlledLocations[i].getVision());
      allDetected = allDetected.concat(this.controlledLocations[i].getDetection());
    }
    for (let i = 0; i < this.fleets.length; i++)
    {
      allVisible = allVisible.concat(this.fleets[i].getVisibleStars());
      allDetected = allDetected.concat(this.fleets[i].getDetectedStars());
    }

    for (let i = 0; i < allVisible.length; i++)
    {
      const star = allVisible[i];
      if (!this.visibleStars[star.id])
      {
        this.visibleStars[star.id] = star;
        if (!previousVisibleStars[star.id])
        {
          visibilityHasChanged = true;
          newVisibleStars.push(star);
        }

        if (!this.revealedStars[star.id])
        {
          this.revealedStars[star.id] = star;
        }
      }
    }

    for (let i = 0; i < allDetected.length; i++)
    {
      const star = allDetected[i];
      if (!this.detectedStars[star.id])
      {
        this.detectedStars[star.id] = star;
        if (!previousDetectedStars[star.id])
        {
          detectionHasChanged = true;
          newDetectedStars.push(star);
        }
      }
    }

    this.visionIsDirty = false;
    if (!visibilityHasChanged)
    {
      visibilityHasChanged = (Object.keys(this.visibleStars).length !==
        Object.keys(previousVisibleStars).length);
    }
    if (!visibilityHasChanged && !detectionHasChanged)
    {
      detectionHasChanged = (Object.keys(this.detectedStars).length !==
        Object.keys(previousDetectedStars).length);
    }

    for (let i = 0; i < newVisibleStars.length; i++)
    {
      this.updateVisionInStar(newVisibleStars[i]);
    }
    for (let i = 0; i < newDetectedStars.length; i++)
    {
      this.updateDetectionInStar(newDetectedStars[i]);
    }

    if (visibilityHasChanged && !this.isAi)
    {
      eventManager.dispatchEvent("renderMap");
    }
    if (detectionHasChanged && !this.isAi)
    {
      eventManager.dispatchEvent("renderLayer", "fleets");
    }
  }
  private getDebugVisibleStars(): Star[]
  {
    if (this.controlledLocations.length > 0)
    {
      return this.controlledLocations[0].getAllLinkedStars();
    }
    else if (Object.keys(this.revealedStars).length > 0)
    {
      const initialStar: Star = this.revealedStars[Object.keys(this.revealedStars)[0]];

      return initialStar.getAllLinkedStars();
    }
    else
    {
      return [];
    }
  }
  getVisibleStars(): Star[]
  {
    if (!this.isAi && options.debug.enabled)
    {
      return this.getDebugVisibleStars();
    }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    const visible: Star[] = [];

    for (const id in this.visibleStars)
    {
      const star = this.visibleStars[id];
      visible.push(star);
    }

    return visible;
  }
  getRevealedStars(): Star[]
  {
    if (!this.isAi && options.debug.enabled)
    {
      return this.getDebugVisibleStars();
    }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    const toReturn: Star[] = [];

    for (const id in this.revealedStars)
    {
      toReturn.push(this.revealedStars[id]);
    }

    return toReturn;
  }
  getRevealedButNotVisibleStars(): Star[]
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    const toReturn: Star[] = [];

    for (const id in this.revealedStars)
    {
      if (!this.visibleStars[id])
      {
        toReturn.push(this.revealedStars[id]);
      }
    }

    return toReturn;
  }
  getDetectedStars(): Star[]
  {
    if (!this.isAi && options.debug.enabled)
    {
      return this.getDebugVisibleStars();
    }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    const toReturn: Star[] = [];

    for (const id in this.detectedStars)
    {
      toReturn.push(this.detectedStars[id]);
    }

    return toReturn;
  }
  starIsVisible(star: Star): boolean
  {
    if (!this.isAi && options.debug.enabled) { return true; }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return Boolean(this.visibleStars[star.id]);
  }
  starIsRevealed(star: Star): boolean
  {
    if (!this.isAi && options.debug.enabled) { return true; }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return Boolean(this.revealedStars[star.id]);
  }
  starIsDetected(star: Star): boolean
  {
    if (!this.isAi && options.debug.enabled) { return true; }
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    return Boolean(this.detectedStars[star.id]);
  }
  getLinksToUnRevealedStars(): ValuesByStar<Star[]>
  {
    if (this.visionIsDirty)
    {
      this.updateVisibleStars();
    }

    const linksBySourceStar = new ValuesByStar<Star[]>();

    for (const starId in this.revealedStars)
    {
      const star = this.revealedStars[starId];
      const links = star.getAllLinks();
      for (let i = 0; i < links.length; i++)
      {
        const linkedStar = links[i];
        if (!this.revealedStars[linkedStar.id])
        {
          if (!linksBySourceStar.has(star))
          {
            linksBySourceStar.set(star, [linkedStar]);
          }
          else
          {
            linksBySourceStar.get(star)!.push(linkedStar);
          }
        }
      }
    }

    return linksBySourceStar;
  }
  identifyUnit(unit: Unit): void
  {
    if (!this.identifiedUnits[unit.id])
    {
      this.identifiedUnits[unit.id] = unit;
    }
  }
  unitIsIdentified(unit: Unit): boolean
  {
    if (options.debug.enabled && !this.isAi)
    {
      return true;
    }
    else
    {
      return Boolean(this.identifiedUnits[unit.id]);
    }
  }
  fleetIsFullyIdentified(fleet: Fleet): boolean
  {
    if (options.debug.enabled && !this.isAi)
    {
      return true;
    }
    for (let i = 0; i < fleet.units.length; i++)
    {
      if (!this.identifiedUnits[fleet.units[i].id])
      {
        return false;
      }
    }

    return true;
  }
  addItem(item: Item): void
  {
    this.items.push(item);
  }
  removeItem(item: Item): void
  {
    const index = this.items.indexOf(item);
    if (index === -1)
    {
      throw new Error(`Player ${this.name} has no item ${item.id}`);
    }

    this.items.splice(index, 1);
  }
  getNearestOwnedStarTo(targetStar: Star): Star
  {
    const isOwnedByThisFN = (star: Star) =>
    {
      return star.owner === this;
    };

    return targetStar.getNearestStarForQualifier(isOwnedByThisFN);
  }
  attackTarget(location: Star, target: FleetAttackTarget, battleFinishCallback?: () => void): void
  {
    const battleData: BattleData =
    {
      location: location,
      building: target.building,
      attacker:
      {
        player: this,
        units: location.getUnits(player => player === this),
      },
      defender:
      {
        player: target.enemy,
        units: target.units,
      },
    };

    const battlePrep = new BattlePrep(battleData);
    if (battlePrep.humanPlayer)
    {
      app.reactUI.battlePrep = battlePrep;
      if (battleFinishCallback)
      {
        battlePrep.afterBattleFinishCallbacks.push(battleFinishCallback);
      }
      app.reactUI.switchScene("battlePrep");
    }
    else
    {
      const battle = battlePrep.makeBattle();
      battle.afterFinishCallbacks.push(battleFinishCallback);
      const simulator = new BattleSimulator(battle);
      simulator.simulateBattle();
      simulator.finishBattle();
    }
  }
  public buildBuilding(template: BuildingTemplate, location: Star): void
  {
    const building = new Building(
    {
      template: template,
      location: location,
    });

    building.controller = this;

    location.buildings.add(building);
    this.removeResources(building.template.buildCost);

    if (template.onBuild)
    {
      template.onBuild(location, this);
    }
  }
  public upgradeBuilding(upgradeData: BuildingUpgradeData): void
  {
    upgradeData.parentBuilding.upgrade(upgradeData);
    this.removeResources(upgradeData.cost);
  }
  public getResearchSpeed(): number
  {
    let research = 0;
    research += activeModuleData.ruleSet.research.baseResearchPoints;

    for (let i = 0; i < this.controlledLocations.length; i++)
    {
      research += this.controlledLocations[i].getResearchPoints();
    }

    return research;
  }
  public getAllOwnedBuildings(): Building[]
  {
    const allBuildings: Building[] = [];

    this.controlledLocations.forEach(location =>
    {
      const ownedBuildingsAtLocation = location.buildings.filter(building =>
      {
        return building.controller === this;
      });

      allBuildings.push(...ownedBuildingsAtLocation);
    });

    return allBuildings;
  }
  getAllManufactories(): Manufactory[]
  {
    const manufactories: Manufactory[] = [];

    for (let i = 0; i < this.controlledLocations.length; i++)
    {
      if (this.controlledLocations[i].manufactory)
      {
        manufactories.push(this.controlledLocations[i].manufactory);
      }
    }

    return manufactories;
  }
  public canAccessManufactoringAtLocation(location: Star): boolean
  {
    return this === location.owner;
  }
  meetsTechRequirements(requirements: TechRequirement[]): boolean
  {
    if (!this.playerTechnology)
    {
      return false;
    }

    for (let i = 0; i < requirements.length; i++)
    {
      const requirement = requirements[i];
      if (this.playerTechnology.technologies[requirement.technology.key].level < requirement.level)
      {
        return false;
      }
    }

    return true;
  }
  serialize(): PlayerSaveData
  {
    const revealedStarIds: number[] = [];
    for (const id in this.revealedStars)
    {
      revealedStarIds.push(this.revealedStars[id].id);
    }

    const identifiedUnitIds: number[] = [];
    for (const id in this.identifiedUnits)
    {
      identifiedUnitIds.push(this.identifiedUnits[id].id);
    }

    const data: PlayerSaveData =
    {
      id: this.id,
      name: this.name.serialize(),
      color: this.color.serialize(),
      colorAlpha: this.colorAlpha,
      secondaryColor: this.secondaryColor.serialize(),
      isIndependent: this.isIndependent,
      isAi: this.isAi,
      resources: {...this.resources},

      fleets: this.fleets.map(fleet => fleet.serialize()),
      controlledLocationIds: this.controlledLocations.map(star => star.id),

      itemIds: this.items.map(item => item.id),
      unitIds: this.units.map(unit => unit.id),
      revealedStarIds: revealedStarIds,
      identifiedUnitIds: identifiedUnitIds,

      raceKey: this.race.type,
      isDead: this.isDead,

      diplomacyData: this.diplomacy ? this.diplomacy.serialize() : null,
      researchByTechnology: this.playerTechnology ? this.playerTechnology.serialize() : null,
      flag: this.flag ? this.flag.serialize() : null,
      AiController: this.aiController ? this.aiController.serialize() : null,

      notificationLog: this.notificationLog ? this.notificationLog.serialize() : null,
    };

    return data;
  }
}
