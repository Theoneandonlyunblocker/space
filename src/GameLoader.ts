
import app from "./App"; // TODO global
import GalaxyMap from "./GalaxyMap";
import Player from "./Player";
import Star from "./Star";
import Unit from "./Unit";
import Building from "./Building";
import Game from "./Game";
import NotificationLog from "./NotificationLog";
import Notification from "./Notification";
import FillerPoint from "./FillerPoint";
import Manufactory from "./Manufactory";
import Color from "./Color";
import AttitudeModifier from "./AttitudeModifier";
import Emblem from "./Emblem";
import Flag from "./Flag";
import Fleet from "./Fleet";
import Item from "./Item";
import MapGenResult from "./MapGenResult";
import Name from "./Name";
import AIController from "./AIController";

import AIControllerSaveData from "./savedata/AIControllerSaveData";
import GameSaveData from "./savedata/GameSaveData";
import NotificationLogSaveData from "./savedata/NotificationLogSaveData";
import GalaxyMapSaveData from "./savedata/GalaxyMapSaveData";
import StarSaveData from "./savedata/StarSaveData";
import BuildingSaveData from "./savedata/BuildingSaveData";
import PlayerSaveData from "./savedata/PlayerSaveData";
import DiplomacyStatusSaveData from "./savedata/DiplomacyStatusSaveData";
import EmblemSaveData from "./savedata/EmblemSaveData";
import FlagSaveData from "./savedata/FlagSaveData";
import FleetSaveData from "./savedata/FleetSaveData";
import UnitSaveData from "./savedata/UnitSaveData";
import ItemSaveData from "./savedata/ItemSaveData";
import NameSaveData from "./savedata/NameSaveData";

import {PlayerRaceTemplate} from "./templateinterfaces/PlayerRaceTemplate";


export default class GameLoader
{
  map: GalaxyMap;
  humanPlayer: Player;
  players: Player[] = [];
  independents: Player[] = [];
  playersById:
  {
    [id: number]: Player;
  } = {};
  starsById:
  {
    [id: number]: Star;
  } = {};
  unitsById:
  {
    [id: number]: Unit;
  } = {};
  buildingsByControllerId:
  {
    [id: number]: Building;
  } = {};

  constructor()
  {

  }

  deserializeGame(data: GameSaveData): Game
  {
    this.map = this.deserializeMap(data.galaxyMap);

    for (let i = 0; i < data.players.length; i++)
    {
      var playerData = data.players[i];
      var id = playerData.id;
      var player = this.playersById[id] = this.deserializePlayer(playerData);
      if (player.isIndependent)
      {
        this.independents.push(player);
      }
      else
      {
        this.players.push(player);
      }
    }
    for (let i = 0; i < data.players.length; i++)
    {
      var playerData = data.players[i];
      this.deserializeDiplomacyStatus(this.playersById[playerData.id], 
        playerData.diplomacyStatus);
      this.deserializeIdentifiedUnits(this.playersById[playerData.id],
        playerData.identifiedUnitIds);
    }

    this.humanPlayer = this.playersById[data.humanPlayerId];

    this.deserializeBuildings(data.galaxyMap);

    var game = new Game(this.map, this.players, this.humanPlayer);
    game.independents = game.independents.concat(this.independents);
    game.turnNumber = data.turnNumber;
    if (data.notificationLog)
    {
      game.notificationLog = this.deserializeNotificationLog(data.notificationLog);
      game.notificationLog.setTurn(game.turnNumber, true);
    }

    data.players.forEach(playerData =>
    {
      const player = this.playersById[playerData.id]; 

      if (playerData.AIController)
      {
        player.AIController = this.deserializeAIController(
          playerData.AIController,
          player,
          game
        )
      }
    });

    return game;
  }
  deserializeNotificationLog(data: NotificationLogSaveData): NotificationLog
  {
    var notificationsData = data.notifications;

    var notificationLog = new NotificationLog(this.humanPlayer);
    for (let i = 0; i < notificationsData.length; i++)
    {
      var template = app.moduleData.Templates.Notifications[notificationsData[i].templateKey];
      var props = template.deserializeProps(notificationsData[i].props, this);
      var notification = new Notification(template, props, notificationsData[i].turn);
      notification.hasBeenRead = notificationsData[i].hasBeenRead;

      notificationLog.addNotification(notification);
    }

    return notificationLog;
  }
  deserializeMap(data: GalaxyMapSaveData): GalaxyMap
  {
    var stars: Star[] = [];

    for (let i = 0; i < data.stars.length; i++)
    {
      var star = this.deserializeStar(data.stars[i]);
      stars.push(star);
      this.starsById[star.id] = star;
    }

    for (let i = 0; i < data.stars.length; i++)
    {
      var dataStar = data.stars[i];
      var realStar = this.starsById[dataStar.id];

      for (let j = 0; j < dataStar.linksToIds.length; j++)
      {
        var linkId = dataStar.linksToIds[j];
        var linkStar = this.starsById[linkId]
        realStar.addLink(linkStar);
      }
    }

    var fillerPoints: FillerPoint[] = [];

    for (let i = 0; i < data.fillerPoints.length; i++)
    {
      var dataPoint = data.fillerPoints[i];
      fillerPoints.push(new FillerPoint(dataPoint.x, dataPoint.y));
    }

    var mapGenResult = new MapGenResult(
    {
      stars: stars,
      fillerPoints: fillerPoints,
      width: data.width,
      height: data.height,
      seed: data.seed,
      independents: null
    });
    
    var galaxyMap = mapGenResult.makeMap();

    return galaxyMap;
  }
  deserializeStar(data: StarSaveData): Star
  {
    var star = new Star(
    {
      x: data.x,
      y: data.y,
      id: data.id,
      name: data.name,
      race: app.moduleData.Templates.Races[data.raceKey]
    });
    star.baseIncome = data.baseIncome;
    star.seed = data.seed;

    if (data.resourceType)
    {
      star.setResource(app.moduleData.Templates.Resources[data.resourceType]);
    }

    return star;
  }
  deserializeBuildings(data: GalaxyMapSaveData): void
  {
    for (let i = 0; i < data.stars.length; i++)
    {
      var starData = data.stars[i];
      var star = this.starsById[starData.id];

      for (let category in starData.buildings)
      {
        for (let j = 0; j < starData.buildings[category].length; j++)
        {
          var buildingData = starData.buildings[category][j];
          var building = this.deserializeBuilding(buildingData);

          star.addBuilding(building);
        }
      }

      if (starData.manufactory)
      {
        star.manufactory = new Manufactory(star, starData.manufactory);
      }
    }
  }
  deserializeBuilding(data: BuildingSaveData): Building
  {
    var template = app.moduleData.Templates.Buildings[data.templateType];
    var building = new Building(
    {
      template: template,
      location: this.starsById[data.locationId],
      controller: this.playersById[data.controllerId],

      upgradeLevel: data.upgradeLevel,
      totalCost: data.totalCost,
      id: data.id
    });

    return building;
  }
  deserializeName(data: NameSaveData): Name
  {
    return Name.fromData(data);
  }
  deserializePlayer(data: PlayerSaveData): Player
  {
    const player = new Player(
    {
      isAI: data.isAI,
      isIndependent: data.isIndependent,

      race: <PlayerRaceTemplate> app.moduleData.Templates.Races[data.raceKey],
      money: data.money,
      
      id: data.id,
      name: this.deserializeName(data.name),
      color:
      {
        main: Color.deSerialize(data.color),
        secondary: Color.deSerialize(data.secondaryColor),
        alpha: data.colorAlpha
      },

      flag: this.deserializeFlag(data.flag),

      resources: data.resources
    });

    // fleets & units
    for (let i = 0; i < data.fleets.length; i++)
    {
      var fleet = data.fleets[i];
      player.addFleet(this.deserializeFleet(player, fleet));
    }

    // stars
    for (let i = 0; i < data.controlledLocationIds.length; i++)
    {
      player.addStar(this.starsById[data.controlledLocationIds[i]]);
    }

    for (let i = 0; i < data.items.length; i++)
    {
      this.deserializeItem(data.items[i], player);
    }

    for (let i = 0; i < data.revealedStarIds.length; i++)
    {
      var id = data.revealedStarIds[i];
      player.revealedStars[id] = this.starsById[id];
    }

    return player;
  }
  deserializeDiplomacyStatus(player: Player, data: DiplomacyStatusSaveData): void
  {
    if (data)
    {
      for (let i = 0; i < data.metPlayerIds.length; i++)
      {
        var id = data.metPlayerIds[i];
        player.diplomacyStatus.metPlayers[id] = this.playersById[id];
      }

      player.diplomacyStatus.statusByPlayer = data.statusByPlayer;

      for (let playerId in data.attitudeModifiersByPlayer)
      {
        var modifiers = data.attitudeModifiersByPlayer[playerId];

        if (!modifiers || modifiers.length === 0)
        {
          player.diplomacyStatus.attitudeModifiersByPlayer[playerId] = [];
          continue;
        }

        for (let i = 0; i < modifiers.length; i++)
        {
          var template = app.moduleData.Templates.AttitudeModifiers[modifiers[i].templateType];
          var modifier = new AttitudeModifier(
          {
            template: template,
            startTurn: modifiers[i].startTurn,
            endTurn: modifiers[i].endTurn,
            strength: modifiers[i].strength
          });

          player.diplomacyStatus.addAttitudeModifier(this.playersById[playerId], modifier);
        }
      }
    }
  }
  deserializeIdentifiedUnits(player: Player, data: number[]): void
  {
    for (let i = 0; i < data.length; i++)
    {
      var unit = this.unitsById[data[i]];
      if (unit)
      {
        player.identifyUnit(unit);
      }
    }
  }
  deserializeEmblem(emblemData: EmblemSaveData): Emblem
  {
    return new Emblem(
      emblemData.colors.map(colorData => Color.deSerialize(colorData)),
      app.moduleData.Templates.SubEmblems[emblemData.templateKey],
      emblemData.alpha
    );
  }
  deserializeFlag(data: FlagSaveData): Flag
  {
    const emblems = data.emblems.map(emblemSaveData =>
    {
      return this.deserializeEmblem(emblemSaveData);
    });
    
    const flag = new Flag(Color.deSerialize(data.mainColor), emblems);

    return flag;
  }
  deserializeFleet(player: Player, data: FleetSaveData): Fleet
  {
    var units: Unit[] = [];

    for (let i = 0; i < data.units.length; i++)
    {
      var unit = this.deserializeUnit(data.units[i]);
      player.addUnit(unit);
      units.push(unit);
    }

    var fleet = new Fleet(player, units, this.starsById[data.locationId], data.id, false);
    fleet.name = Name.fromData(data.name);

    return fleet;
  }
  deserializeUnit(data: UnitSaveData): Unit
  {
    var template = app.moduleData.Templates.Units[data.templateType];

    var unit = new Unit(template, data.id, data);

    this.unitsById[unit.id] = unit;

    return unit;
  }
  deserializeItem(data: ItemSaveData, player: Player): void
  {
    var template = app.moduleData.Templates.Items[data.templateType];

    var item = new Item(template, data.id);

    player.addItem(item);
    if (isFinite(data.unitId))
    {
      this.unitsById[data.unitId].items.addItem(item, data.positionInUnit);
    }
  }
  private deserializeAIController<S>(
    data: AIControllerSaveData<S>,
    player: Player,
    game: Game
  ): AIController
  {
    const templateConstructor = app.moduleData.Templates.AITemplateConstructors[data.templateType];

    const template = templateConstructor.construct(
    {
      game: game,
      player: player,
      saveData: data.templateData,
      personality: data.personality
    });

    const controller = new AIController(template);

    return controller;
  }
}

