import UIComponent from "./uicomponents/PlayerDiedNotification";

import {localize, localizeF} from "../localization/localize";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/NotificationWitnessCriterion";
import Player from "../../../src/Player";
import {activeNotificationLog} from "../../../src/activeNotificationLog";


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
  iconSrc: "modules/common/resourcetemplates/img/test3.png",
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localizeF("playerDiedMessage").format(
    {
      playerName: props.deadPlayerName,
    });
  },
  getTitle: (props: PropTypes) => localize("playerDiedTitle"),
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
          activeNotificationLog.makeNotification<PropTypes, SerializedPropTypes>(
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
