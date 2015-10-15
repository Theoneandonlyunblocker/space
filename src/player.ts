/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="building.ts" />
/// <reference path="star.ts" />
/// <reference path="flag.ts" />
/// <reference path="item.ts" />
/// <reference path="battlesimulator.ts" />
/// <reference path="battleprep.ts" />
/// <reference path="diplomacystatus.ts" />
/// <reference path="manufactory.ts" />

/// <reference path="mapai/aicontroller.ts"/>

module Rance
{

  export class Player
  {
    id: number;
    name: string;
    color: number;
    colorAlpha: number;
    secondaryColor: number;
    flag: Flag;
    units:
    {
      [id: number]: Unit;
    } = {};
    resources:
    {
      [resourceType: string]: number;
    } = {};
    fleets: Fleet[] = [];
    items: Item[] = [];

    isAI: boolean = false;
    personality: IPersonality;
    AIController: MapAI.AIController;
    isIndependent: boolean = false;

    diplomacyStatus: DiplomacyStatus;

    private _money: number;
    get money(): number
    {
      return this._money;
    }
    set money(amount: number)
    {
      this._money = amount;
      if (!this.isAI)
      {
        eventManager.dispatchEvent("playerMoneyUpdated");
      }
    }
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

    technologies:
    {
      [technologyKey: string]:
      {
        technology: Templates.ITechnologyTemplate;
        totalResearch: number;
        level: number;
        priority: number;
        priorityIsLocked: boolean;
      }
    };

    constructor(isAI: boolean, id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.player++;
      this.name = "Player " + this.id;

      this.isAI = isAI;
      this.diplomacyStatus = new DiplomacyStatus(this);

      this.money = 1000;
    }
    destroy()
    {
      this.diplomacyStatus.destroy();
      this.diplomacyStatus = null;
      this.AIController = null;
    }
    die()
    {
      console.log(this.name + " died");
      for (var i = 0; i < this.fleets.length; i++)
      {
        this.fleets[i].deleteFleet(false);
      }
    }
    initTechnologies(savedData?:
      {[key: string]: {totalResearch: number; priority: number; priorityIsLocked: boolean}})
    {
      this.technologies = {};
      var totalTechnologies = Object.keys(app.moduleData.Templates.Technologies).length;
      for (var key in app.moduleData.Templates.Technologies)
      {
        var technology = app.moduleData.Templates.Technologies[key]
        this.technologies[key] =
        {
          technology: technology,
          totalResearch: 0,
          level: 0,
          priority: 1 / totalTechnologies,
          priorityIsLocked: false
        }

        if (savedData && savedData[key])
        {
          this.addResearchTowardsTechnology(technology, savedData[key].totalResearch);
          this.technologies[key].priority = savedData[key].priority;
          this.technologies[key].priorityIsLocked = savedData[key].priorityIsLocked;
        }
      }
    }
    makeColorScheme()
    {
      var scheme = generateColorScheme(this.color);

      this.color = scheme.main;
      this.secondaryColor = scheme.secondary;
    }
    setupAI(game: Game)
    {
      this.AIController = new MapAI.AIController(this, game, this.personality);
    }
    setupPirates()
    {
      this.name = "Independents"
      this.color = 0x000000;
      this.colorAlpha = 0;
      this.secondaryColor = 0xFFFFFF;

      this.isIndependent = true;

      var foregroundEmblem = new Emblem(this.secondaryColor);
      foregroundEmblem.inner = 
      {
        key: "pirateEmblem",
        src: "img\/emblems\/Flag_of_Edward_England.svg",
        coverage: [SubEmblemCoverage.both],
        position: [SubEmblemPosition.both]
      };

      this.flag = new Flag(
      {
        width: 46, // FLAG_SIZE
        mainColor: this.color,
        secondaryColor: this.secondaryColor
      });

      this.flag.setForegroundEmblem(foregroundEmblem);
    }
    makeRandomFlag(seed?: any)
    {
      if (!this.color || !this.secondaryColor) this.makeColorScheme();

      this.flag = new Flag(
      {
        width: 46, // FLAG_SIZE
        mainColor: this.color,
        secondaryColor: this.secondaryColor
      });

      this.flag.generateRandom(seed);
    }
    addUnit(unit: Unit)
    {
      this.units[unit.id] = unit;
    }
    removeUnit(unit: Unit)
    {
      this.units[unit.id] = null;
      delete this.units[unit.id];
    }
    getAllUnits()
    {
      var allUnits: Unit[] = [];
      for (var unitId in this.units)
      {
        allUnits.push(this.units[unitId]);
      }
      return allUnits;
    }
    forEachUnit(operator: (unit: Unit) => void)
    {
      for (var unitId in this.units)
      {
        operator(this.units[unitId]);
      }
    }
    getFleetIndex(fleet: Fleet)
    {
      return this.fleets.indexOf(fleet);
    }
    addFleet(fleet: Fleet)
    {
      if (this.getFleetIndex(fleet) >= 0)
      {
        return;
      }

      this.fleets.push(fleet);
      this.visionIsDirty = true;
    }
    removeFleet(fleet: Fleet)
    {
      var fleetIndex = this.getFleetIndex(fleet);

      if (fleetIndex < 0) return;

      this.fleets.splice(fleetIndex, 1);
      this.visionIsDirty = true;
    }
    getFleetsWithPositions()
    {
      var positions:
      {
        position: Point;
        data: Fleet;
      }[] = [];

      for (var i = 0; i < this.fleets.length; i++)
      {
        var fleet = this.fleets[i];

        positions.push(
        {
          position: fleet.location,
          data: fleet
        });
      }

      return positions;
    }

    hasStar(star: Star)
    {
      return (this.controlledLocations.indexOf(star) >= 0);
    }
    addStar(star: Star)
    {
      if (this.hasStar(star)) return false;

      star.owner = this;
      this.controlledLocations.push(star);
      this.visionIsDirty = true;
    }
    removeStar(star: Star)
    {
      var index = this.controlledLocations.indexOf(star);

      if (index < 0) return false;

      star.owner = null;
      this.controlledLocations.splice(index, 1);
      this.visionIsDirty = true;
      if (this.controlledLocations.length === 0)
      {
        app.game.killPlayer(this);
      }
    }
    getIncome()
    {
      var income = 0;

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        income += this.controlledLocations[i].getIncome();
      }

      return income;
    }
    addResource(resource: Templates.IResourceTemplate, amount: number)
    {
      if (!this.resources[resource.type])
      {
        this.resources[resource.type] = 0;
      }

      this.resources[resource.type] += amount;
    }
    getResourceIncome()
    {
      var incomeByResource:
      {
        [resourceType: string]:
        {
          resource: Templates.IResourceTemplate;
          amount: number;
        };
      } = {};

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var star = this.controlledLocations[i];

        var starIncome = star.getResourceIncome();

        if (!starIncome) continue;

        if (!incomeByResource[starIncome.resource.type])
        {
          incomeByResource[starIncome.resource.type] =
          {
            resource: starIncome.resource,
            amount: 0
          }
        }

        incomeByResource[starIncome.resource.type].amount += starIncome.amount;
      }

      return incomeByResource;
    }
    getNeighboringStars(): Star[]
    {
      var stars:
      {
        [id: number]: Star;
      } = {};

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var currentOwned = this.controlledLocations[i];
        var frontier =  currentOwned.getLinkedInRange(1).all;
        for (var j = 0; j < frontier.length; j++)
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

      var allStars: Star[] = [];

      for (var id in stars)
      {
        allStars.push(stars[id]);
      }

      return allStars;
    }
    updateVisionInStar(star: Star)
    {
      // meet players
      if (this.diplomacyStatus.getUnMetPlayerCount() > 0)
      {
        this.meetPlayersInStarByVisibility(star, "visible");
      }
    }
    updateDetectionInStar(star: Star)
    {
      // meet players
      if (this.diplomacyStatus.getUnMetPlayerCount() > 0)
      {
        this.meetPlayersInStarByVisibility(star, "detected");
      }
      // identify ships
      var unitsToIdentify = star.getAllShips();
      for (var i = 0; i < unitsToIdentify.length; i++)
      {
        this.identifyUnit(unitsToIdentify[i]);
      }
    }
    updateAllVisibilityInStar(star: Star)
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
    meetPlayersInStarByVisibility(star: Star, visibility: string)
    {
      var presentPlayersByVisibility = star.getPresentPlayersByVisibility();

      for (var playerId in presentPlayersByVisibility[visibility])
      {
        var player = presentPlayersByVisibility[visibility][playerId];
        if (!player.isIndependent && !this.diplomacyStatus.metPlayers[playerId] && !this.isIndependent)
        {
          this.diplomacyStatus.meetPlayer(player);
        }
      }
    }
    updateVisibleStars()
    {
      var previousVisibleStars = extendObject(this.visibleStars);
      var previousDetectedStars = extendObject(this.detectedStars);
      var newVisibleStars: Star[] = [];
      var newDetectedStars: Star[] = [];
      var visibilityHasChanged: boolean = false;
      var detectionHasChanged: boolean = false;
      this.visibleStars = {};
      this.detectedStars = {};

      var allVisible: Star[] = [];
      var allDetected: Star[] = [];
      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        allVisible = allVisible.concat(this.controlledLocations[i].getVision());
        allDetected = allDetected.concat(this.controlledLocations[i].getDetection());
      }
      for (var i = 0; i < this.fleets.length; i++)
      {
        allVisible = allVisible.concat(this.fleets[i].getVision());
        allDetected = allDetected.concat(this.fleets[i].getDetection());
      }

      for (var i = 0; i < allVisible.length; i++)
      {
        var star = allVisible[i];
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

      for (var i = 0; i < allDetected.length; i++)
      {
        var star = allDetected[i];
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

      for (var i = 0; i < newVisibleStars.length; i++)
      {
        this.updateVisionInStar(newVisibleStars[i]);
      }
      for (var i = 0; i < newDetectedStars.length; i++)
      {
        this.updateDetectionInStar(newDetectedStars[i]);
      }

      if (visibilityHasChanged && !this.isAI)
      {
        eventManager.dispatchEvent("renderMap");
      }
      if (detectionHasChanged && !this.isAI)
      {
        eventManager.dispatchEvent("renderLayer", "fleets");
      }
    }
    getVisibleStars(): Star[]
    {
      if (!this.isAI && Options.debugMode)
      {
        return this.controlledLocations[0].getLinkedInRange(9999).all;
      }
      if (this.visionIsDirty) this.updateVisibleStars();

      var visible: Star[] = [];

      for (var id in this.visibleStars)
      {
        var star = this.visibleStars[id];
        visible.push(star);
      }

      return visible;
    }
    getRevealedStars(): Star[]
    {
      if (!this.isAI && Options.debugMode)
      {
        return this.controlledLocations[0].getLinkedInRange(9999).all;
      }
      if (this.visionIsDirty) this.updateVisibleStars();

      var toReturn: Star[] = [];

      for (var id in this.revealedStars)
      {
        toReturn.push(this.revealedStars[id]);
      }

      return toReturn;
    }
    getRevealedButNotVisibleStars(): Star[]
    {
      if (this.visionIsDirty) this.updateVisibleStars();

      var toReturn: Star[] = [];

      for (var id in this.revealedStars)
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
      if (!this.isAI && Options.debugMode)
      {
        return this.controlledLocations[0].getLinkedInRange(9999).all;
      }
      if (this.visionIsDirty) this.updateVisibleStars();

      var toReturn: Star[] = [];

      for (var id in this.detectedStars)
      {
        toReturn.push(this.detectedStars[id]);
      }

      return toReturn;
    }
    starIsVisible(star: Star): boolean
    {
      if (!this.isAI && Options.debugMode) return true;
      if (this.visionIsDirty) this.updateVisibleStars();
      return Boolean(this.visibleStars[star.id]);
    }
    starIsRevealed(star: Star): boolean
    {
      if (!this.isAI && Options.debugMode) return true;
      if (this.visionIsDirty) this.updateVisibleStars();
      return Boolean(this.revealedStars[star.id]);
    }
    starIsDetected(star: Star): boolean
    {
      if (!this.isAI && Options.debugMode) return true;
      if (this.visionIsDirty) this.updateVisibleStars();
      return Boolean(this.detectedStars[star.id]);
    }
    getLinksToUnRevealedStars()
    {
      if (this.visionIsDirty) this.updateVisibleStars();
      
      var linksBySourceStarId:
      {
        [starId: number]: Star[];
      } = {};

      for (var starId in this.revealedStars)
      {
        var star = this.revealedStars[starId];
        var links = star.getAllLinks();
        for (var i = 0; i < links.length; i++)
        {
          var linkedStar = links[i];
          if (!this.revealedStars[linkedStar.id])
          {
            if (!linksBySourceStarId[star.id])
            {
              linksBySourceStarId[star.id] = [linkedStar];
            }
            else
            {
              linksBySourceStarId[star.id].push(linkedStar);
            }
          }
        }
      }

      return linksBySourceStarId;
    }
    identifyUnit(unit: Unit)
    {
      if (!this.identifiedUnits[unit.id])
      {
        this.identifiedUnits[unit.id] = unit;
      }
    }
    unitIsIdentified(unit: Unit)
    {
      if (Options.debugMode && !this.isAI)
      {
        return true;
      }
      else return Boolean(this.identifiedUnits[unit.id]) || Boolean(this.units[unit.id]);
    }
    fleetIsFullyIdentified(fleet: Fleet)
    {
      if (Options.debugMode && !this.isAI)
      {
        return true;
      }
      for (var i = 0; i < fleet.ships.length; i++)
      {
        if (!this.identifiedUnits[fleet.ships[i].id])
        {
          return false;
        }
      }

      return true;
    }
    addItem(item: Item)
    {
      this.items.push(item);
    }
    removeItem(item: Item)
    {
      var index = this.items.indexOf(item);
      if (index === -1)
      {
        throw new Error("Player " + this.name + " has no item " + item.id);
      }

      this.items.splice(index, 1);
    }
    getNearestOwnedStarTo(star: Star)
    {
      var self = this;
      var isOwnedByThisFN = function(star: Star)
      {
        return star.owner === self;
      }

      return star.getNearestStarForQualifier(isOwnedByThisFN);
    }
    attackTarget(location: Star, target: any, battleFinishCallback?: any)
    {
      var battleData: IBattleData =
      {
        location: location,
        building: target.building,
        attacker:
        {
          player: this,
          ships: location.getAllShipsOfPlayer(this)
        },
        defender:
        {
          player: target.enemy,
          ships: target.ships
        }
      }

      // TODO
      var battlePrep = new BattlePrep(battleData);
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
        var battle = battlePrep.makeBattle();
        battle.afterFinishCallbacks.push(battleFinishCallback);
        var simulator = new BattleSimulator(battle);
        simulator.simulateBattle();
        simulator.finishBattle();
      }
    }
    // research and technology
    getResearchSpeed(): number
    {
      var research: number = 30;

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        research += this.controlledLocations[i].getResearchPoints();
      }

      return research;
    }
    allocateResearchPoints(): void
    {
      // probably not needed as priority should always add up to 1 anyway,
      // but this is cheap and infrequently called so this is here as a safeguard at least for now
      var totalPriority: number = 0;
      for (var key in this.technologies)
      {
        totalPriority += this.technologies[key].priority;
      }

      var researchSpeed = this.getResearchSpeed();

      for (var key in this.technologies)
      {
        var techData = this.technologies[key];
        var relativePriority = techData.priority / totalPriority;
        if (relativePriority > 0)
        {
          this.addResearchTowardsTechnology(techData.technology, relativePriority * researchSpeed);
        }
      }
    }
    getResearchNeededForTechnologyLevel(level: number): number
    {
      if (level <= 0) return 0;
      if (level === 1) return 40;

      var a = 20;
      var b = 40;
      var swap: number;

      var total = 0;

      for (var i = 0; i < level; i++)
      {
        swap = a;
        a = b;
        b = swap + b;
        total += a;
      }

      return total;
    }
    addResearchTowardsTechnology(technology: Templates.ITechnologyTemplate, amount: number): void
    {
      var tech = this.technologies[technology.key]
      tech.totalResearch += amount;
      var overflow: number;

      if (tech.level >= technology.maxLevel) // TODO probably shouldnt happen in the first place
      {
        overflow = amount;
      }
      else
      {
        while (tech.level < technology.maxLevel &&
          this.getResearchNeededForTechnologyLevel(tech.level + 1) <= tech.totalResearch)
        {
          tech.level++;
        }
        if (tech.level === technology.maxLevel)
        {
          var neededForMaxLevel = this.getResearchNeededForTechnologyLevel(tech.level);
          overflow = tech.totalResearch - neededForMaxLevel;
          tech.totalResearch -= neededForMaxLevel;
        }
      }

      // TODO handle overflow
    }
    setTechnologyPriority(technology: Templates.ITechnologyTemplate, priority: number)
    {
      var remainingPriority = 1;

      var totalOtherPriority: number = 0;
      var totalOtherPriorityWasZero: boolean = false;
      var totalOthersCount: number = 0;
      for (var key in this.technologies)
      {
        if (key !== technology.key)
        {
          if (this.technologies[key].priorityIsLocked)
          {
            remainingPriority -= this.technologies[key].priority;
          }
          else
          {
            totalOtherPriority += this.technologies[key].priority;
            totalOthersCount++;
          }
        }
      }
      if (totalOthersCount === 0) return;

      if (remainingPriority < 0.0001)
      {
        remainingPriority = 0;
      }

      if (priority > remainingPriority)
      {
        priority = remainingPriority;
      }
      this.technologies[technology.key].priority = priority;
      remainingPriority -= priority;


      if (totalOtherPriority === 0)
      {
        totalOtherPriority = 1;
        totalOtherPriorityWasZero = true;
      }

      for (var key in this.technologies)
      {
        if (key !== technology.key && !this.technologies[key].priorityIsLocked)
        {
          var techData = this.technologies[key];
          if (totalOtherPriorityWasZero)
          {
            techData.priority = 1 / totalOthersCount;
          }
          var relativePriority = techData.priority / totalOtherPriority;
          techData.priority = relativePriority * remainingPriority;
        }
      }

      eventManager.dispatchEvent("technologyPrioritiesUpdated");
    }
    // MANUFACTORIES
    getAllManufactories(): Manufactory[]
    {
      var manufactories: Manufactory[] = [];

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        if (this.controlledLocations[i].manufactory)
        {
          manufactories.push(this.controlledLocations[i].manufactory);
        }
      }

      return manufactories;
    }
    meetsTechnologyRequirements(requirements: Templates.ITechnologyRequirement[])
    {
      for (var i = 0; i < requirements.length; i++)
      {
        var requirement = requirements[i];
        if (this.technologies[requirement.technology.key].level < requirement.level)
        {
          return false;
        }
      }

      return true;
    }
    getGloballyBuildableUnits()
    {
      var templates: Templates.IUnitTemplate[] = [];
      var typesAlreadyAddedChecked:
      {
        [unitType: string]: boolean;
      } = {};

      var unitsToAdd: Templates.IUnitTemplate[] = app.moduleData.Templates.UnitFamilies["basic"].associatedTemplates.slice(0);
      if (!this.isAI && Options.debugMode)
      {
        unitsToAdd = unitsToAdd.concat(app.moduleData.Templates.UnitFamilies["debug"].associatedTemplates);
      }

      for (var i = 0; i < unitsToAdd.length; i++)
      {
        var template = unitsToAdd[i];
        if (typesAlreadyAddedChecked[template.type]) continue;
        else if (template.technologyRequirements && !this.meetsTechnologyRequirements(template.technologyRequirements))
        {
          typesAlreadyAddedChecked[template.type] = true;
          continue;
        }
        else
        {
          typesAlreadyAddedChecked[template.type] = true;
          templates.push(template);
        }
      }

      return templates;
    }
    getGloballyBuildableItems()
    {
      // TODO manufactory
      var itemTypes: Templates.IItemTemplate[] = [];

      for (var key in app.moduleData.Templates.Items)
      {
        itemTypes.push(app.moduleData.Templates.Items[key]);
      }

      return itemTypes;
    }
    getManufacturingCapacityFor(template: IManufacturableThing, type: string)
    {
      var totalCapacity = 0;
      var capacityByStar:
      {
        star: Star;
        capacity: number;
      }[] = [];
      var isGloballyBuildable: boolean;
      switch (type)
      {
        case "item":
        {
          var globallyBuildableItems = <IManufacturableThing[]> this.getGloballyBuildableItems();
          isGloballyBuildable = globallyBuildableItems.indexOf(template) !== -1;
        }
        case "unit":
        {
          var globallyBuildableUnits = <IManufacturableThing[]> this.getGloballyBuildableUnits();
          isGloballyBuildable = globallyBuildableUnits.indexOf(template) !== -1;
        }
      }
      var manufactories = this.getAllManufactories();

      for (var i = 0; i < manufactories.length; i++)
      {
        var manufactory = manufactories[i];
        var isBuildable = !manufactory.queueIsFull() &&
          (isGloballyBuildable || manufactory.canManufactureThing(template, type));
        if (isBuildable)
        {
          var capacity = manufactory.capacity - manufactory.buildQueue.length;
          totalCapacity += capacity;
          capacityByStar.push(
          {
            star: manufactory.star,
            capacity: capacity
          });
        }
      }

      return totalCapacity;
    }
    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.name = this.name;
      data.color = this.color;
      data.colorAlpha = this.colorAlpha;
      data.secondaryColor = this.secondaryColor;
      data.isIndependent = this.isIndependent;
      data.isAI = this.isAI;
      data.resources = extendObject(this.resources);

      data.diplomacyStatus = this.diplomacyStatus.serialize();

      if (this.flag)
      {
        data.flag = this.flag.serialize();
      }

      data.unitIds = [];
      for (var id in this.units)
      {
        data.unitIds.push(id);
      }
      data.fleets = this.fleets.map(function(fleet){return fleet.serialize()});
      data.money = this.money;
      data.controlledLocationIds =
        this.controlledLocations.map(function(star){return star.id});

      data.items = this.items.map(function(item){return item.serialize()});

      data.revealedStarIds = [];
      for (var id in this.revealedStars)
      {
        data.revealedStarIds.push(this.revealedStars[id].id);
      }

      data.identifiedUnitIds = [];
      for (var id in this.identifiedUnits)
      {
        data.identifiedUnitIds.push(this.identifiedUnits[id].id);
      }

      if (this.isAI && this.AIController)
      {
        data.personality = extendObject(this.AIController.personality);
      }
      
      data.researchByTechnology = {};
      for (var key in this.technologies)
      {
        data.researchByTechnology[key] =
        {
          totalResearch: this.technologies[key].totalResearch,
          priority: this.technologies[key].priority,
          priorityIsLocked: this.technologies[key].priorityIsLocked
        }
      }

      return data;
    }
  }  
}
