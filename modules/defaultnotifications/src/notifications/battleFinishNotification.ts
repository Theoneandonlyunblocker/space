import {Battle} from "core/src/battle/Battle";
import {GameLoader} from "core/src/saves/GameLoader";
import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import {NotificationFilterState} from "core/src/notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "core/src/notifications/NotificationWitnessCriterion";
import {activeNotificationStore} from "core/src/app/activeNotificationStore";
import {NotificationTemplate} from "core/src/templateinterfaces/NotificationTemplate";
import {localize, localizeString} from "../../localization/localize";
import {getIcon} from "../../assets/assets";

import {BattleFinishNotification as UIComponent} from "./uicomponents/BattleFinishNotification";
import { PartialCoreScriptsWithData } from "core/src/triggeredscripts/AllCoreScriptsWithData";


export interface PropTypes
{
  location: Star;
  attacker: Player;
  defender: Player;
  victor: Player;
  newController: Player;
}

export interface SerializedPropTypes
{
  attackerId: number;
  defenderId: number;
  locationId: number;
  victorId: number;
  newControllerId: number;
}

export const battleFinishNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "battleFinishNotification",
  get displayName()
  {
    return localizeString("battleFinishNotification_displayName");
  },
  get category()
  {
    return localizeString("notificationCategory_combat");
  },
  defaultFilterState: [NotificationFilterState.NeverShow],
  witnessCriteria:
  [
    [NotificationWitnessCriterion.IsInvolved],
    [NotificationWitnessCriterion.LocationIsVisible],
  ],
  getIcon: (props: PropTypes) =>
  {
    const involvedMajorPlayers = [props.defender, props.attacker].filter(player => !player.isIndependent);
    const minorPlayerWasInvolved = involvedMajorPlayers.length !== 2;
    const loser = props.victor === props.defender ? props.attacker : props.defender;

    const [color1, color2] = minorPlayerWasInvolved ?
      [involvedMajorPlayers[0].color, involvedMajorPlayers[0].color] :
      [props.victor.color, loser.color];

    const icon = getIcon("swords-emblem", props.victor.id, loser.id);
    icon.foreground.style.fill = "transparent";
    icon.gradientStop1.style.stopColor = `#${color1.getHexString()}`;
    icon.gradientStop2.style.stopColor = `#${color2.getHexString()}`;
    icon.background.style.fill = `url(#${icon.gradient.id})`;

    return icon.element;
  },
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localize("battleFinishMessage").format(
    {
      attackerName: props.attacker.name,
      defenderName: props.defender.name,
    });
  },
  getTitle: (props: PropTypes) => localize("battleFinishTitle").toString(),
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      attackerId: props.attacker.id,
      defenderId: props.defender.id,
      locationId: props.location.id,
      victorId: props.victor.id,
      newControllerId: props.newController.id,
    });
  },
  deserializeProps: (props: SerializedPropTypes, gameLoader: GameLoader) =>
  {
    return(
    {
      attacker: gameLoader.playersById[props.attackerId],
      defender: gameLoader.playersById[props.defenderId],
      location: gameLoader.starsById[props.locationId],
      victor: gameLoader.playersById[props.victorId],
      newController: gameLoader.playersById[props.newControllerId],
    });
  },
};

export const battleFinishNotificationCreationScripts: PartialCoreScriptsWithData =
{
  onBattleFinish:
  {
    makeBattleFinishNotification:
    {
      triggerPriority: 0,
      callback: (battle: Battle) =>
      {
        activeNotificationStore.makeNotification<PropTypes, SerializedPropTypes>(
        {
          template: battleFinishNotification,
          props:
          {
            location: battle.battleData.location,
            attacker: battle.battleData.attacker.player,
            defender: battle.battleData.defender.player,
            victor: battle.victor,
            newController: battle.battleData.location.owner,
          },
          involvedPlayers: [battle.side1Player, battle.side2Player],
          location: battle.battleData.location,
        });
      },
    },
  },
};
