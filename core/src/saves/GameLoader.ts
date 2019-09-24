
import {AiController} from "../ai/AiController";
import {AttitudeModifier} from "../diplomacy/AttitudeModifier";
import {Building} from "../building/Building";
import {Color} from "../color/Color";
import {Emblem} from "../flag/Emblem";
import {FillerPoint} from "../map/FillerPoint";
import {Flag} from "../flag/Flag";
import {Fleet} from "../fleets/Fleet";
import {GalaxyMap} from "../map/GalaxyMap";
import {Game} from "../game/Game";
import {Item} from "../items/Item";
import {Manufactory} from "../production/Manufactory";
import {MapGenResult} from "../map/MapGenResult";
import {Name} from "../localization/Name";
import {Player} from "../player/Player";
import {Star} from "../map/Star";
import {StatusEffect} from "../unit/StatusEffect";
import {Unit} from "../unit/Unit";
import {activeModuleData} from "../app/activeModuleData";
import {setActiveNotificationStore} from "../app/activeNotificationStore";

import {Notification} from "../notifications/Notification";
import {NotificationStore} from "../notifications/NotificationStore";

import { NotificationSubscriber } from "../notifications/NotificationSubscriber";
import { PlayerNotificationSubscriber } from "../notifications/PlayerNotificationSubscriber";
import {AiControllerSaveData} from "../savedata/AiControllerSaveData";
import {BuildingSaveData} from "../savedata/BuildingSaveData";
import {EmblemSaveData} from "../savedata/EmblemSaveData";
import {FlagSaveData} from "../savedata/FlagSaveData";
import {FleetSaveData} from "../savedata/FleetSaveData";
import {GalaxyMapSaveData} from "../savedata/GalaxyMapSaveData";
import {GameSaveData} from "../savedata/GameSaveData";
import {ItemSaveData} from "../savedata/ItemSaveData";
import {NotificationStoreSaveData} from "../savedata/NotificationStoreSaveData";
import { NotificationSubscriberSaveData } from "../savedata/NotificationSubscriberSaveData";
import {PlayerDiplomacySaveData} from "../savedata/PlayerDiplomacySaveData";
import {PlayerSaveData} from "../savedata/PlayerSaveData";
import {StarSaveData} from "../savedata/StarSaveData";
import {StatusEffectSaveData} from "../savedata/StatusEffectSaveData";
import {UnitSaveData} from "../savedata/UnitSaveData";


export class GameLoader
{
  // these are public as GameLoader objects can get passed around to deserializing functions which might want access
  public map: GalaxyMap;
  public players: Player[] = [];
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
      this.players.push(player);
    }

    // buildings
    this.deserializeBuildings(data.galaxyMap);

    // create game
    const game = new Game(this.map, this.players);
    game.turnNumber = data.turnNumber;

    // player diplomacy status. dependant on other players & game
    data.players.forEach(playerData =>
    {
      const player = this.playersById[playerData.id];
      if (!player.isDead && player.diplomacy && playerData.diplomacyData)
      {
        this.deserializePlayerDiplomacy(player, playerData.diplomacyData);
      }
    });

    // notification store
    const notificationStore = this.deserializeNotificationStore(data.notificationStore);
    setActiveNotificationStore(notificationStore);

    // notification subscribers
    data.players.filter(playerData => !playerData.isDead && playerData.notificationLog).forEach(playerData =>
    {
      const player = this.playersById[playerData.id];
      const subscriber = new PlayerNotificationSubscriber(player);

      player.notificationLog = this.deserializeNotificationSubscriber(
        playerData.notificationLog,
        subscriber,
        notificationStore,
      );
    });

    // ai controllers
    data.players.forEach(playerData =>
    {
      const player = this.playersById[playerData.id];

      if (!playerData.isDead && playerData.AiController)
      {
        player.aiController = this.deserializeAiController(
          playerData.AiController,
          player,
          game,
        );
      }
    });

    return game;
  }

  private deserializeNotificationStore(data: NotificationStoreSaveData): NotificationStore
  {
    const notificationStore = new NotificationStore();

    data.notifications.forEach(notificationData =>
    {
      const template = activeModuleData.templates.Notifications[notificationData.templateKey];

      const notification = new Notification(
      {
        id: notificationData.id,
        template: activeModuleData.templates.Notifications[notificationData.templateKey],
        props: template.deserializeProps(notificationData.props, this),
        turn: notificationData.turn,
        involvedPlayers: notificationData.involvedPlayerIds.map(id => this.playersById[id]),
        location: isFinite(notificationData.locationId) ? this.starsById[notificationData.locationId] : undefined,
      });

      notificationStore.notificationsById[notification.id] = notification;
    });

    return notificationStore;
  }
  private deserializeNotificationSubscriber<T extends NotificationSubscriber>(
    data: NotificationSubscriberSaveData,
    liveSubscriber: T,
    liveStore: NotificationStore,
  ): T
  {
    data.allReceivedNotificationIds.forEach(id =>
    {
      const notification = liveStore.notificationsById[id];

      liveSubscriber.allReceivedNotifications.push(notification);
    });

    data.unreadNotificationIds.forEach(id =>
    {
      const notification = liveStore.notificationsById[id];

      liveSubscriber.unreadNotifications.push(notification);
    });

    return liveSubscriber;
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
      seed: data.seed,
      name: data.name,
      race: activeModuleData.templates.Races[data.raceType],
      terrain: activeModuleData.templates.Terrains[data.terrainType],
    });
    star.baseIncome = data.baseIncome;

    if (data.resourceType)
    {
      star.resource = activeModuleData.templates.Resources[data.resourceType];
    }

    return star;
  }
  private deserializeBuildings(data: GalaxyMapSaveData): void
  {
    for (let i = 0; i < data.stars.length; i++)
    {
      const starData = data.stars[i];
      const star = this.starsById[starData.id];

      starData.buildings.forEach(buildingData =>
      {
        const building = this.deserializeBuilding(buildingData);

        star.buildings.add(building);
      });

      if (starData.manufactory)
      {
        star.manufactory = new Manufactory(star, starData.manufactory);
      }
    }
  }
  private deserializeBuilding<T extends Building>(data: BuildingSaveData): T
  {
    const template = activeModuleData.templates.Buildings[data.templateType];
    const building = new Building(
    {
      template: template,
      location: this.starsById[data.locationId],
      controller: this.playersById[data.controllerId],

      totalCost: data.totalCost,
      id: data.id,
    });

    return <T>building;
  }
  private deserializePlayer(data: PlayerSaveData): Player
  {
    const player = new Player(
    {
      isAi: data.isAi,
      isIndependent: data.isIndependent,
      isDead: data.isDead,

      race: activeModuleData.templates.Races[data.raceKey],
      money: data.money,

      id: data.id,
      name: Name.fromData(data.name),
      color:
      {
        main: Color.deserialize(data.color),
        secondary: Color.deserialize(data.secondaryColor),
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
  private deserializePlayerDiplomacy(player: Player, data: PlayerDiplomacySaveData): void
  {
    for (const playerId in data.statusByPlayer)
    {
      player.diplomacy.setStatusWithPlayer(this.playersById[playerId], data.statusByPlayer[playerId]);
    }

    for (const playerId in data.attitudeModifiersByPlayer)
    {
      const modifiers = data.attitudeModifiersByPlayer[playerId];

      modifiers.forEach(modifierData =>
      {
        const template = activeModuleData.templates.AttitudeModifiers[modifierData.templateType];
        const modifier = new AttitudeModifier(
        {
          template: template,
          startTurn: modifierData.startTurn,
          endTurn: modifierData.endTurn === null ?
            Infinity :
            modifierData.endTurn,
          strength: modifierData.strength,
          hasFixedStrength: modifierData.hasFixedStrength,
        });

        player.diplomacy.addAttitudeModifier(this.playersById[playerId], modifier);
      });
    }
  }
  private deserializeEmblem(emblemData: EmblemSaveData): Emblem
  {
    return new Emblem(
      emblemData.colors.map(colorData => Color.deserialize(colorData)),
      activeModuleData.templates.SubEmblems[emblemData.templateKey],
    );
  }
  private deserializeFlag(data: FlagSaveData): Flag
  {
    const emblems = data.emblems.map(emblemSaveData =>
    {
      return this.deserializeEmblem(emblemSaveData);
    });

    const flag = new Flag(Color.deserialize(data.mainColor), emblems);

    return flag;
  }
  private deserializeFleet(player: Player, data: FleetSaveData): Fleet
  {
    const units = data.unitIds.map(unitId => this.unitsById[unitId]);
    const location = this.starsById[data.locationId];

    const fleet = Fleet.createFleet(
    {
      units: units,
      player: player,
      id: data.id,
      name: Name.fromData(data.name),
    });

    player.addFleet(fleet);
    location.addFleet(fleet);

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
    const template = activeModuleData.templates.Items[data.templateType];

    const item = new Item(template, data.id);
    item.positionInUnit = data.positionInUnit;

    return item;
  }
  private deserializeAiController<S>(
    data: AiControllerSaveData<S>,
    player: Player,
    game: Game,
  ): AiController<S>
  {
    const templateConstructor = activeModuleData.templates.AiTemplateConstructors[data.templateType];

    const template = templateConstructor.construct(
    {
      game: game,
      player: player,
      saveData: data.templateData,
      personality: data.personality,
    });

    const controller = new AiController(template);

    return controller;
  }
  private deserializeStatusEffect(data: StatusEffectSaveData): StatusEffect
  {
    return new StatusEffect(
    {
      id: data.id,
      template: activeModuleData.templates.UnitEffects[data.templateType],
      turnsToStayActiveFor: data.turnsToStayActiveFor,
      turnsHasBeenActiveFor: data.turnsHasBeenActiveFor,
      sourceUnit: this.unitsById[data.sourceUnitId],
    });
  }
}

