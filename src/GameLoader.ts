
import {AIController} from "./AIController";
import app from "./App"; // TODO global
import {AttitudeModifier} from "./AttitudeModifier";
import Building from "./Building";
import Color from "./Color";
import Emblem from "./Emblem";
import FillerPoint from "./FillerPoint";
import {Flag} from "./Flag";
import {Fleet} from "./Fleet";
import GalaxyMap from "./GalaxyMap";
import Game from "./Game";
import Item from "./Item";
import Manufactory from "./Manufactory";
import MapGenResult from "./MapGenResult";
import Name from "./Name";
import Notification from "./Notification";
import NotificationLog from "./NotificationLog";
import Player from "./Player";
import Star from "./Star";
import StatusEffect from "./StatusEffect";
import Unit from "./Unit";

import AIControllerSaveData from "./savedata/AIControllerSaveData";
import BuildingSaveData from "./savedata/BuildingSaveData";
import DiplomacyStatusSaveData from "./savedata/DiplomacyStatusSaveData";
import EmblemSaveData from "./savedata/EmblemSaveData";
import FlagSaveData from "./savedata/FlagSaveData";
import FleetSaveData from "./savedata/FleetSaveData";
import GalaxyMapSaveData from "./savedata/GalaxyMapSaveData";
import GameSaveData from "./savedata/GameSaveData";
import ItemSaveData from "./savedata/ItemSaveData";
import NotificationLogSaveData from "./savedata/NotificationLogSaveData";
import PlayerSaveData from "./savedata/PlayerSaveData";
import StarSaveData from "./savedata/StarSaveData";
import {StatusEffectSaveData} from "./savedata/StatusEffectSaveData";
import UnitSaveData from "./savedata/UnitSaveData";


export default class GameLoader
{
  public map: GalaxyMap;
  public humanPlayer: Player;
  public players: Player[] = [];
  public independents: Player[] = [];

  public playersById:
  {
    [id: number]: Player;
  } = {};
  public starsById:
  {
    [id: number]: Star;
  } = {};
  public unitsById:
  {
    [id: number]: Unit;
  } = {};
  public buildingsByControllerId:
  {
    [id: number]: Building;
  } = {};
  public itemsById:
  {
    [id: number]: Item;
  } = {};

  constructor()
  {

  }

  public deserializeGame(data: GameSaveData): Game
  {
    // map
    this.map = this.deserializeMap(data.galaxyMap);

    // items
    data.items.forEach(itemSaveData =>
    {
      this.itemsById[itemSaveData.id] = this.deserializeItem(itemSaveData);
    });
    // units
    data.units.forEach(unitSaveData =>
    {
      this.unitsById[unitSaveData.id] = this.deserializeUnit(unitSaveData);
    });
    // unit status effects. dependant on other units so have to do these after
    data.units.forEach(unitSaveData =>
    {
      const unit = this.unitsById[unitSaveData.id];

      unitSaveData.battleStats.statusEffects.forEach(statusEffectSaveData =>
      {
        unit.addStatusEffect(this.deserializeStatusEffect(statusEffectSaveData));
      });
    });

    // players
    for (let i = 0; i < data.players.length; i++)
    {
      const playerData = data.players[i];
      const id = playerData.id;
      const player = this.playersById[id] = this.deserializePlayer(playerData);
      if (player.isIndependent)
      {
        this.independents.push(player);
      }
      else
      {
        this.players.push(player);
      }
    }

    // player diplomacy status. dependant on other players
    for (let i = 0; i < data.players.length; i++)
    {
      const playerData = data.players[i];
      this.deserializeDiplomacyStatus(
        this.playersById[playerData.id],
        playerData.diplomacyStatus,
      );
    }

    this.humanPlayer = this.playersById[data.humanPlayerId];

    // buildings
    this.deserializeBuildings(data.galaxyMap);

    // create game
    const game = new Game(this.map, this.players, this.humanPlayer);
    game.independents = game.independents.concat(this.independents);
    game.turnNumber = data.turnNumber;

    // notification log
    if (data.notificationLog)
    {
      game.notificationLog = this.deserializeNotificationLog(data.notificationLog);
      game.notificationLog.setTurn(game.turnNumber, true);
    }

    // ai controllers
    data.players.forEach(playerData =>
    {
      const player = this.playersById[playerData.id];

      if (playerData.AIController)
      {
        player.AIController = this.deserializeAIController(
          playerData.AIController,
          player,
          game,
        );
      }
    });

    return game;
  }
  private deserializeNotificationLog(data: NotificationLogSaveData): NotificationLog
  {
    const notificationLog = new NotificationLog(this.humanPlayer);

    data.notifications.forEach(notificationData =>
    {
      const template = app.moduleData.Templates.Notifications[notificationData.templateKey];
      const props = template.deserializeProps(notificationData.props, this);
      const players = notificationData.involvedPlayerIds.map(id => this.playersById[id]);
      const notification = new Notification(template, props, notificationData.turn, players);
      notification.hasBeenRead = notificationData.hasBeenRead;

      notificationLog.addNotification(notification);
    });

    return notificationLog;
  }
  private deserializeMap(data: GalaxyMapSaveData): GalaxyMap
  {
    const stars: Star[] = [];

    for (let i = 0; i < data.stars.length; i++)
    {
      const star = this.deserializeStar(data.stars[i]);
      stars.push(star);
      this.starsById[star.id] = star;
    }

    for (let i = 0; i < data.stars.length; i++)
    {
      const dataStar = data.stars[i];
      const realStar = this.starsById[dataStar.id];

      for (let j = 0; j < dataStar.linksToIds.length; j++)
      {
        const linkId = dataStar.linksToIds[j];
        const linkStar = this.starsById[linkId];
        realStar.addLink(linkStar);
      }
    }

    const fillerPoints: FillerPoint[] = [];

    for (let i = 0; i < data.fillerPoints.length; i++)
    {
      const dataPoint = data.fillerPoints[i];
      fillerPoints.push(new FillerPoint(dataPoint.x, dataPoint.y));
    }

    const mapGenResult = new MapGenResult(
    {
      stars: stars,
      fillerPoints: fillerPoints,
      width: data.width,
      height: data.height,
      seed: data.seed,
      independents: null,
    });

    const galaxyMap = mapGenResult.makeMap();

    return galaxyMap;
  }
  private deserializeStar(data: StarSaveData): Star
  {
    const star = new Star(
    {
      x: data.x,
      y: data.y,
      id: data.id,
      name: data.name,
      race: app.moduleData.Templates.Races[data.raceType],
    });
    star.baseIncome = data.baseIncome;
    star.seed = data.seed;

    if (data.resourceType)
    {
      star.setResource(app.moduleData.Templates.Resources[data.resourceType]);
    }

    return star;
  }
  private deserializeBuildings(data: GalaxyMapSaveData): void
  {
    for (let i = 0; i < data.stars.length; i++)
    {
      const starData = data.stars[i];
      const star = this.starsById[starData.id];

      for (let category in starData.buildings)
      {
        for (let j = 0; j < starData.buildings[category].length; j++)
        {
          const buildingData = starData.buildings[category][j];
          const building = this.deserializeBuilding(buildingData);

          star.addBuilding(building);
        }
      }

      if (starData.manufactory)
      {
        star.manufactory = new Manufactory(star, starData.manufactory);
      }
    }
  }
  private deserializeBuilding(data: BuildingSaveData): Building
  {
    const template = app.moduleData.Templates.Buildings[data.templateType];
    const building = new Building(
    {
      template: template,
      location: this.starsById[data.locationId],
      controller: this.playersById[data.controllerId],

      upgradeLevel: data.upgradeLevel,
      totalCost: data.totalCost,
      id: data.id,
    });

    return building;
  }
  private deserializePlayer(data: PlayerSaveData): Player
  {
    const player = new Player(
    {
      isAI: data.isAI,
      isIndependent: data.isIndependent,

      race: app.moduleData.Templates.Races[data.raceKey],
      money: data.money,

      id: data.id,
      name: Name.fromData(data.name),
      color:
      {
        main: Color.deSerialize(data.color),
        secondary: Color.deSerialize(data.secondaryColor),
        alpha: data.colorAlpha,
      },

      flag: this.deserializeFlag(data.flag),

      resources: data.resources,
    });

    // units
    data.unitIds.forEach(unitId =>
    {
      player.addUnit(this.unitsById[unitId]);
    });

    // fleets
    for (let i = 0; i < data.fleets.length; i++)
    {
      const fleet = data.fleets[i];
      player.addFleet(this.deserializeFleet(player, fleet));
    }

    // stars
    for (let i = 0; i < data.controlledLocationIds.length; i++)
    {
      player.addStar(this.starsById[data.controlledLocationIds[i]]);
    }

    // items
    data.itemIds.forEach(itemId =>
    {
      player.addItem(this.itemsById[itemId]);
    });

    // revealed stars
    for (let i = 0; i < data.revealedStarIds.length; i++)
    {
      const id = data.revealedStarIds[i];
      player.revealedStars[id] = this.starsById[id];
    }

    // identified units
    data.identifiedUnitIds.forEach(unitId =>
    {
      // unit might have been identified but was removed from game before serialization
      if (this.unitsById[unitId])
      {
        player.identifyUnit(this.unitsById[unitId]);
      }
    });

    return player;
  }
  private deserializeDiplomacyStatus(player: Player, data: DiplomacyStatusSaveData): void
  {
    if (data)
    {
      for (let i = 0; i < data.metPlayerIds.length; i++)
      {
        const id = data.metPlayerIds[i];
        player.diplomacyStatus.metPlayers[id] = this.playersById[id];
      }

      player.diplomacyStatus.statusByPlayer = data.statusByPlayer;

      for (let playerId in data.attitudeModifiersByPlayer)
      {
        const modifiers = data.attitudeModifiersByPlayer[playerId];

        if (!modifiers || modifiers.length === 0)
        {
          player.diplomacyStatus.attitudeModifiersByPlayer[playerId] = [];
          continue;
        }

        for (let i = 0; i < modifiers.length; i++)
        {
          const template = app.moduleData.Templates.AttitudeModifiers[modifiers[i].templateType];
          const modifier = new AttitudeModifier(
          {
            template: template,
            startTurn: modifiers[i].startTurn,
            endTurn: modifiers[i].endTurn,
            strength: modifiers[i].strength,
          });

          player.diplomacyStatus.addAttitudeModifier(this.playersById[playerId], modifier);
        }
      }
    }
  }
  private deserializeEmblem(emblemData: EmblemSaveData): Emblem
  {
    return new Emblem(
      emblemData.colors.map(colorData => Color.deSerialize(colorData)),
      app.moduleData.Templates.SubEmblems[emblemData.templateKey],
      emblemData.alpha,
    );
  }
  private deserializeFlag(data: FlagSaveData): Flag
  {
    const emblems = data.emblems.map(emblemSaveData =>
    {
      return this.deserializeEmblem(emblemSaveData);
    });

    const flag = new Flag(Color.deSerialize(data.mainColor), emblems);

    return flag;
  }
  private deserializeFleet(player: Player, data: FleetSaveData): Fleet
  {
    const units = data.unitIds.map(unitId => this.unitsById[unitId]);
    const location = this.starsById[data.locationId];

    const fleet = new Fleet(units, data.id);

    player.addFleet(fleet);
    location.addFleet(fleet);

    fleet.name = Name.fromData(data.name);

    return fleet;
  }
  private deserializeUnit(data: UnitSaveData): Unit
  {
    const unit = Unit.fromSaveData(data);

    data.items.itemIds.forEach(itemId =>
    {
      const item = this.itemsById[itemId];
      unit.items.addItemAtPosition(item, item.positionInUnit);
    });

    return unit;
  }
  private deserializeItem(data: ItemSaveData): Item
  {
    const template = app.moduleData.Templates.Items[data.templateType];

    const item = new Item(template, data.id);
    item.positionInUnit = data.positionInUnit;

    return item;
  }
  private deserializeAIController<S>(
    data: AIControllerSaveData<S>,
    player: Player,
    game: Game,
  ): AIController<S>
  {
    const templateConstructor = app.moduleData.Templates.AITemplateConstructors[data.templateType];

    const template = templateConstructor.construct(
    {
      game: game,
      player: player,
      saveData: data.templateData,
      personality: data.personality,
    });

    const controller = new AIController(template);

    return controller;
  }
  private deserializeStatusEffect(data: StatusEffectSaveData): StatusEffect
  {
    return new StatusEffect(
    {
      id: data.id,
      template: app.moduleData.Templates.StatusEffects[data.templateType],
      turnsToStayActiveFor: data.turnsToStayActiveFor,
      turnsHasBeenActiveFor: data.turnsHasBeenActiveFor,
      sourceUnit: this.unitsById[data.sourceUnitId],
    });
  }
}

