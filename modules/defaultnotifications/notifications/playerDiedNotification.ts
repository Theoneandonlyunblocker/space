import UIComponent from "./uicomponents/PlayerDiedNotification.ts";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate.d.ts";

import GameLoader from "../../../src/GameLoader.ts";
import NotificationFilterState from "../../../src/NotificationFilterState.ts";

export interface PropTypes
{
  deadPlayerName: string;
}

interface SerializedPropTypes
{
  deadPlayerName: string;
}

const playerDiedNotification: NotificationTemplate =
{
  key: "playerDiedNotification",
  displayName: "Player died",
  category: "game",
  defaultFilterState: [NotificationFilterState.alwaysShow],
  iconSrc: "modules\/default\/img\/resources\/test1.png",
  eventListeners: ["makePlayerDiedNotification"],
  contentConstructor: UIComponent,
  messageConstructor: function(props: PropTypes)
  {
    var message = "Player " + props.deadPlayerName + " died";

    return message;
  },
  serializeProps: function(props: PropTypes): SerializedPropTypes
  {
    return(
    {
      deadPlayerName: props.deadPlayerName
    });
  },
  deserializeProps: function(props: SerializedPropTypes, gameLoader: GameLoader): PropTypes
  {
    return(
    {
      deadPlayerName: props.deadPlayerName
    });
  }
}

export default playerDiedNotification;
