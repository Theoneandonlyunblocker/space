import UIComponent from "./uicomponents/WarDeclarationNotification.ts";

import NotificationTemplate from "../../src/templateinterfaces/NotificationTemplate.d.ts";

import GameLoader from "../../src/GameLoader.ts";
import NotificationFilterState from "../../src/NotificationFilterState.ts";
import Player from "../../src/Player.ts";

export interface PropTypes
{
  player1: Player;
  player2: Player;
}

interface SerializedPropTypes
{
  player1Id: number;
  player2Id: number;
}

const WarDeclarationNotification: NotificationTemplate =
{
  key: "WarDeclarationNotification",
  displayName: "War declaration",
  category: "diplomacy",
  defaultFilterState: [NotificationFilterState.showIfInvolved],
  iconSrc: "modules\/default\/img\/resources\/test2.png",
  eventListeners: ["makeWarDeclarationNotification"],
  contentConstructor: UIComponent,
  messageConstructor: function(props: PropTypes)
  {
    var message = props.player1.name + " declared war on " + props.player2.name;

    return message;
  },
  serializeProps: function(props: PropTypes): SerializedPropTypes
  {
    return(
    {
      player1Id: props.player1.id,
      player2Id: props.player2.id,
    });
  },
  deserializeProps: function(props: SerializedPropTypes, gameLoader: GameLoader): PropTypes
  {
    return(
    {
      player1: gameLoader.playersById[props.player1Id],
      player2: gameLoader.playersById[props.player2Id],
    });
  }
}

export default WarDeclarationNotification;
