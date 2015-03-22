/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="building.ts" />
/// <reference path="star.ts" />
/// <reference path="flag.ts" />
/// <reference path="item.ts" />
/// <reference path="battlesimulator.ts" />

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
    icon: string;
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
    AIController: AIController;
    isIndependent: boolean = false;

    money: number;
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

    constructor(isAI: boolean, id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.player++;
      this.name = "Player " + this.id;

      this.isAI = isAI;

      this.money = 1000;
    }
    makeColorScheme()
    {
      var scheme = generateColorScheme(this.color);

      this.color = scheme.main;
      this.secondaryColor = scheme.secondary;
    }
    setupAI(game: Game)
    {
      this.AIController = new AIController(this, game);
    }
    setupPirates()
    {
      this.name = "Independent"
      this.color = 0x000000;
      this.colorAlpha = 0;
      this.secondaryColor = 0xFFFFFF;

      this.isIndependent = true;

      var foregroundEmblem = new Emblem(this.secondaryColor);
      foregroundEmblem.inner = 
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "pirateEmblem.png"
      };

      this.flag = new Flag(
      {
        width: 46,
        mainColor: this.color,
        secondaryColor: this.secondaryColor,
        foregroundEmblem: foregroundEmblem
      });

      var canvas = this.flag.draw();
      this.icon = canvas.toDataURL();
    }
    makeFlag(seed?: any)
    {
      if (!this.color || !this.secondaryColor) this.makeColorScheme();

      this.flag = new Flag(
      {
        width: 46,
        mainColor: this.color,
        secondaryColor: this.secondaryColor
      });

      this.flag.generateRandom(seed);
      var canvas = this.flag.draw();
      this.icon = canvas.toDataURL();
    }
    setIcon(base64: string)
    {
      this.icon = base64;
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
      var allUnits = [];
      for (var unitId in this.units)
      {
        allUnits.push(this.units[unitId]);
      }
      return allUnits;
    }
    forEachUnit(operator: (Unit) => void)
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
      var positions = [];

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

      this.controlledLocations.push(star);
      this.visionIsDirty = true;
    }
    removeStar(star: Star)
    {
      var index = this.controlledLocations.indexOf(star);

      if (index < 0) return false;

      this.controlledLocations.splice(index, 1);
      this.visionIsDirty = true;
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
    getBuildableShips()
    {
      var templates = [];

      for (var type in Templates.ShipTypes)
      {
        templates.push(Templates.ShipTypes[type]);
      }

      return templates;
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

      var allStars = [];

      for (var id in stars)
      {
        allStars.push(stars[id]);
      }

      return allStars;
    }
    updateVisibleStars()
    {
      this.visibleStars = {};

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var starVisible = this.controlledLocations[i].getVision();

        for (var j = 0; j < starVisible.length; j++)
        {
          var star = starVisible[j];
          if (!this.visibleStars[star.id])
          {
            this.visibleStars[star.id] = star;

            if (!this.revealedStars[star.id])
            {
              this.revealedStars[star.id] = star;
            }
          }
        }
      }

      for (var i = 0; i < this.fleets.length; i++)
      {
        var fleetVisible = this.fleets[i].getVision();

        for (var j = 0; j < fleetVisible.length; j++)
        {
          var star = fleetVisible[j];
          if (!this.visibleStars[star.id])
          {
            this.visibleStars[star.id] = star;

            if (!this.revealedStars[star.id])
            {
              this.revealedStars[star.id] = star;
            }
          }
        }
      }

      this.visionIsDirty = false;

      eventManager.dispatchEvent("renderMap");
    }
    getVisibleStars(): Star[]
    {
      if (this.visionIsDirty) this.updateVisibleStars();

      var visible: Star[] = [];

      for (var id in this.visibleStars)
      {
        visible.push(this.visibleStars[id]);
      }

      return visible;
    }
    getRevealedStars(): Star[]
    {
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
    buildUnit(template: Templates.IUnitTemplate, location: Star)
    {
      var unit = new Rance.Unit(template);
      this.addUnit(unit);

      var fleet = new Fleet(this, [unit], location);

      this.money -= template.buildCost;

      eventManager.dispatchEvent("playerControlUpdated");

      return unit;
    }
    addItem(item: Item)
    {
      this.items.push(item);
    }
    getAllBuildableItems()
    {
      var alreadyAdded: any = {};
      var allBuildable = [];

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var star = this.controlledLocations[i];

        var buildableItems = star.getBuildableItems().all;
        for (var j = 0; j < buildableItems.length; j++)
        {
          var item = buildableItems[j];

          if (alreadyAdded[item.type])
          {
            continue;
          }
          else
          {
            alreadyAdded[item.type] = true;
            allBuildable.push(
            {
              star: star,
              template: item
            });
          }
        }
      }

      return allBuildable;
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
        app.reactUI.switchScene("battlePrep");
      }
      else
      {
        var battle = battlePrep.makeBattle();
        battle.afterFinishCallbacks.push(battleFinishCallback);
        var simulator = new BattleSimulator(battle, 50);
        simulator.simulateBattle();
        simulator.finishBattle();
      }
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

      if (this.flag)
      {
        data.flag = this.flag.serialize();
      }
      else
      {
        data.icon = this.icon;
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
        data.revealedStarIds.push(parseInt(id));
      }

      data.buildings = [];
      

      return data;
    }
  }  
}
