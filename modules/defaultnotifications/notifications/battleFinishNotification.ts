import UIComponent from "./uicomponents/BattleFinishNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import app from "../../../src/App"; // TODO global
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

export interface SerializedPropTypes
{
  attackerId: number;
  defenderId: number;
  locationId: number;
  victorId: number;
}

const battleFinishNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "battleFinishNotification",
  displayName: "Battle finished",
  category: "combat",
  defaultFilterState: [NotificationFilterState.neverShow],
  iconSrc: "modules/common/resourcetemplates/img/test1.png",
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    const message = "A battle was fought in " + props.location.name + " between " +
      props.attacker.name.fullName + " and " + props.defender.name.fullName;

    return message;
  },
  getTitle: (props: PropTypes) => "Battle finished",
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      attackerId: props.attacker.id,
      defenderId: props.defender.id,
      locationId: props.location.id,
      victorId: props.victor.id,
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
    });
  },
};

activeModuleData.scripts.add(
{
  battle:
  {
    // TODO 2017.07.14 | implement & do other notifications as well
    battleFinish: [],
  },
});

export default battleFinishNotification;
