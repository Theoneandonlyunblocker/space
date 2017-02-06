import UIComponent from "./uicomponents/BattleFinishNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import Player from "../../../src/Player";
import Star from "../../../src/Star";

export interface PropTypes
{
  location: Star;
  attacker: Player;
  defender: Player;
  victor: Player;
}

interface SerializedPropTypes
{
  attackerId: number;
  defenderId: number;
  locationId: number;
  victorId: number;
}

const battleFinishNotification: NotificationTemplate =
{
  key: "battleFinishNotification",
  displayName: "Battle finished",
  category: "combat",
  defaultFilterState: [NotificationFilterState.neverShow],
  iconSrc: "modules/common/resourcetemplates/img/test1.png",
  eventListeners: ["makeBattleFinishNotification"],
  contentConstructor: UIComponent,
  messageConstructor: function(props: PropTypes)
  {
    var message = "A battle was fought in " + props.location.name + " between " +
      props.attacker.name.fullName + " and " + props.defender.name.fullName;

    return message;
  },
  serializeProps: function(props: PropTypes): SerializedPropTypes
  {
    return(
    {
      attackerId: props.attacker.id,
      defenderId: props.defender.id,
      locationId: props.location.id,
      victorId: props.victor.id,
    });
  },
  deserializeProps: function(props:SerializedPropTypes, gameLoader: GameLoader): PropTypes
  {
    return(
    {
      attacker: gameLoader.playersById[props.attackerId],
      defender: gameLoader.playersById[props.defenderId],
      location: gameLoader.starsById[props.locationId],
      victor: gameLoader.playersById[props.victorId],
    });
  },
}

export default battleFinishNotification;
