import UIComponent from "./uicomponents/PlayerDiedNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";


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
  iconSrc: "modules/common/resourcetemplates/img/test1.png",
  // eventListeners: ["makePlayerDiedNotification"],
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

export default playerDiedNotification;
