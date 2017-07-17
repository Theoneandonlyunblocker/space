import UIComponent from "./uicomponents/BattleFinishNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/NotificationWitnessCriterion";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import {activeModuleData} from "../../../src/activeModuleData";
import {activeNotificationLog} from "../../../src/activeNotificationLog";


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
  witnessCriteria:
  [
    [NotificationWitnessCriterion.isInvolved],
    [NotificationWitnessCriterion.locationIsVisible]
  ],
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
    battleFinish:
    [
      battle =>
      {
        activeNotificationLog.makeNotification(battleFinishNotification,
        {
          location: battle.battleData.location,
          attacker: battle.battleData.attacker.player,
          defender: battle.battleData.defender.player,
          victor: battle.victor,
        },
          [battle.side1Player, battle.side2Player],
        );
      },
    ],
  },
});

export default battleFinishNotification;
