import {localize} from "../localization/localize";

import {NotificationTemplate} from "../../../src/templateinterfaces/NotificationTemplate";

import {GameLoader} from "../../../src/GameLoader";
import {Player} from "../../../src/Player";
import {NotificationFilterState} from "../../../src/notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/notifications/NotificationWitnessCriterion";
import {activeNotificationStore} from "../../../src/notifications/activeNotificationStore";

import {PlayerDiedNotification as UIComponent} from "./uicomponents/PlayerDiedNotification";
import {getIconSrc} from "../assets";


export interface PropTypes
{
  deadPlayerName: string;
}

export interface SerializedPropTypes
{
  deadPlayerName: string;
}

export const playerDiedNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "playerDiedNotification",
  displayName: "Player died",
  category: "game",
  defaultFilterState: [NotificationFilterState.AlwaysShow],
  witnessCriteria: [[NotificationWitnessCriterion.MetOneInvolvedPlayer]],
  getIconSrc: getIconSrc.bind(null, "test3"),
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localize("playerDiedMessage")(
    {
      playerName: props.deadPlayerName,
      // TODO 2017.12.08 | plural names
      count: 1,
    });
  },
  getTitle: (props: PropTypes) => localize("playerDiedTitle")(),
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      deadPlayerName: props.deadPlayerName,
    });
  },
  deserializeProps: (props: SerializedPropTypes, gameLoader: GameLoader) =>
  {
    return(
    {
      deadPlayerName: props.deadPlayerName,
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
        priority: 0,
        script: (player: Player) =>
        {
          activeNotificationStore.makeNotification<PropTypes, SerializedPropTypes>(
          {
            template: playerDiedNotification,
            props:
            {
              deadPlayerName: player.name.fullName,
            },
            involvedPlayers: [player],
            location: null,
          });
        },
      },
    ],
  },
};
