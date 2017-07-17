import UIComponent from "./uicomponents/WarDeclarationNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/NotificationWitnessCriterion";
import Player from "../../../src/Player";
import {activeModuleData} from "../../../src/activeModuleData";
import {activeNotificationLog} from "../../../src/activeNotificationLog";


// TODO 2017.07.15 | clarify these names. aggressor/defender
export interface PropTypes
{
  player1: Player;
  player2: Player;
}

export interface SerializedPropTypes
{
  player1Id: number;
  player2Id: number;
}

const warDeclarationNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "warDeclarationNotification",
  displayName: "War declaration",
  category: "diplomacy",
  defaultFilterState: [NotificationFilterState.showIfInvolved],
  witnessCriteria:
  [
    [NotificationWitnessCriterion.isInvolved],
    [NotificationWitnessCriterion.metAllInvolvedPlayers],
  ],
  iconSrc: "modules/common/resourcetemplates/img/test2.png",
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    const message = props.player1.name + " declared war on " + props.player2.name;

    return message;
  },
  getTitle: (props: PropTypes) => "War declaration",
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      player1Id: props.player1.id,
      player2Id: props.player2.id,
    });
  },
  deserializeProps: (props: SerializedPropTypes, gameLoader: GameLoader) =>
  {
    return(
    {
      player1: gameLoader.playersById[props.player1Id],
      player2: gameLoader.playersById[props.player2Id],
    });
  },
};

activeModuleData.scripts.add(
  {
    diplomacy:
    {
      onWarDeclaration:
      [
        (aggressor, defender) =>
        {
          activeNotificationLog.makeNotification(
          {
            template: warDeclarationNotification,
            props:
            {
              player1: aggressor,
              player2: defender,
            },
            involvedPlayers: [aggressor, defender],
            location: null,
          });
        },
      ],
    },
  });

export default warDeclarationNotification;
