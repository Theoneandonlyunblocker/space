import {localize, localizeString} from "../../localization/localize";

import {NotificationTemplate} from "core/src/templateinterfaces/NotificationTemplate";

import {GameLoader} from "core/src/saves/GameLoader";
import {Player} from "core/src/player/Player";
import {NotificationFilterState} from "core/src/notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "core/src/notifications/NotificationWitnessCriterion";
import {activeNotificationStore} from "core/src/app/activeNotificationStore";

import {PlayerDiedNotification as UIComponent} from "./uicomponents/PlayerDiedNotification";
import {getIcon} from "../../assets/assets";


export interface PropTypes
{
  player: Player;
}

export interface SerializedPropTypes
{
  playerId: number;
}

export const playerDiedNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "playerDiedNotification",
  get displayName()
  {
    return localizeString("playerDiedNotification_displayName");
  },
  get category()
  {
    return localizeString("notificationCategory_game");
  },
  defaultFilterState: [NotificationFilterState.AlwaysShow],
  witnessCriteria: [[NotificationWitnessCriterion.MetOneInvolvedPlayer]],
  getIcon: (props: PropTypes) =>
  {
    const icon = getIcon("hasty-grave", props.player.id);
    icon.foreground.style.fill = "transparent";
    icon.background.style.fill = `#${props.player.color.getHexString()}`;

    return icon.element;
  },
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localize("playerDiedMessage").format(
    {
      playerName: props.player.name,
    });
  },
  getTitle: (props: PropTypes) => localize("playerDiedTitle").toString(),
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      playerId: props.player.id,
    });
  },
  deserializeProps: (props: SerializedPropTypes, gameLoader: GameLoader) =>
  {
    return(
    {
      player: gameLoader.playersById[props.playerId],
    });
  },
};

export const playerDiedNotificationCreationScripts =
{
  player:
  {
    onDeath:
    [
      {
        key: "playerDiedNotification",
        triggerPriority: 0,
        script: (player: Player) =>
        {
          activeNotificationStore.makeNotification<PropTypes, SerializedPropTypes>(
          {
            template: playerDiedNotification,
            props:
            {
              player: player,
            },
            involvedPlayers: [player],
            location: null,
          });
        },
      },
    ],
  },
};
