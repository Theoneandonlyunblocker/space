import Battle from "../../../src/Battle";
import GameLoader from "../../../src/GameLoader";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import {NotificationFilterState} from "../../../src/notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/notifications/NotificationWitnessCriterion";
import {activeNotificationStore} from "../../../src/notifications/activeNotificationStore";
import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";
import {localize} from "../localization/localize";

import UIComponent from "./uicomponents/BattleFinishNotification";
import {getIconSrc} from "../assets";


export interface PropTypes
{
  location: Star;
  attacker: Player;
  defender: Player;
  victor: Player;
  newController: Player;
}

export interface SerializedPropTypes
{
  attackerId: number;
  defenderId: number;
  locationId: number;
  victorId: number;
  newControllerId: number;
}

export const battleFinishNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "battleFinishNotification",
  displayName: "Battle finished",
  category: "combat",
  defaultFilterState: [NotificationFilterState.NeverShow],
  witnessCriteria:
  [
    [NotificationWitnessCriterion.IsInvolved],
    [NotificationWitnessCriterion.LocationIsVisible],
  ],
  getIconSrc: getIconSrc.bind(null, "test1"),
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localize("battleFinishMessage")(
    {
      locationName: props.location.name,
      attackerName: props.attacker.name.toString(),
      defenderName: props.defender.name.toString(),
    });
  },
  getTitle: (props: PropTypes) => localize("battleFinishTitle")(),
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      attackerId: props.attacker.id,
      defenderId: props.defender.id,
      locationId: props.location.id,
      victorId: props.victor.id,
      newControllerId: props.newController.id,
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
      newController: gameLoader.playersById[props.newControllerId],
    });
  },
};

export const battleFinishNotificationCreationScripts =
{
  battle:
  {
    battleFinish:
    [
      {
        key: "makeBattleFinishNotification",
        priority: 0,
        script: (battle: Battle) =>
        {
          activeNotificationStore.makeNotification<PropTypes, SerializedPropTypes>(
          {
            template: battleFinishNotification,
            props:
            {
              location: battle.battleData.location,
              attacker: battle.battleData.attacker.player,
              defender: battle.battleData.defender.player,
              victor: battle.victor,
              newController: battle.battleData.location.owner,
            },
            involvedPlayers: [battle.side1Player, battle.side2Player],
            location: battle.battleData.location,
          });
        },
      },
    ],
  },
};
