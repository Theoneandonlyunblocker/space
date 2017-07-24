import UIComponent from "./uicomponents/PlayerDiedNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/NotificationWitnessCriterion";
import {activeModuleData} from "../../../src/activeModuleData";
import {activeNotificationLog} from "../../../src/activeNotificationLog";


export interface PropTypes
{
  deadPlayerName: string;
}

export interface SerializedPropTypes
{
  deadPlayerName: string;
}

const playerDiedNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "playerDiedNotification",
  displayName: "Player died",
  category: "game",
  defaultFilterState: [NotificationFilterState.alwaysShow],
  witnessCriteria: [[NotificationWitnessCriterion.metOneInvolvedPlayer]],
  iconSrc: "modules/common/resourcetemplates/img/test1.png",
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    const message = "Player " + props.deadPlayerName + " died";

    return message;
  },
  getTitle: (props: PropTypes) => "Player died",
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

// TODO 2017.07.24 | these should be added in module loading phase
activeModuleData.scripts.add(
{
  player:
  {
    onDeath:
    [
      {
        key: "playerDiedNotification",
        priority: 0,
        script: player =>
        {
          activeNotificationLog.makeNotification(
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
});

export default playerDiedNotification;
