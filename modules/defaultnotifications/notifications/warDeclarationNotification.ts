import UIComponent from "./uicomponents/WarDeclarationNotification";

import NotificationTemplate from "../../../src/templateinterfaces/NotificationTemplate";

import GameLoader from "../../../src/GameLoader";
import NotificationFilterState from "../../../src/NotificationFilterState";
import {NotificationWitnessCriterion} from "../../../src/NotificationWitnessCriterion";
import Player from "../../../src/Player";
import {activeModuleData} from "../../../src/activeModuleData";
import {activeNotificationLog} from "../../../src/activeNotificationLog";


export interface PropTypes
{
  aggressor: Player;
  defender: Player;
}

export interface SerializedPropTypes
{
  aggressorId: number;
  defenderId: number;
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
    const message = props.aggressor.name + " declared war on " + props.defender.name;

    return message;
  },
  getTitle: (props: PropTypes) => "War declaration",
  serializeProps: (props: PropTypes) =>
  {
    return(
    {
      aggressorId: props.aggressor.id,
      defenderId: props.defender.id,
    });
  },
  deserializeProps: (props: SerializedPropTypes, gameLoader: GameLoader) =>
  {
    return(
    {
      aggressor: gameLoader.playersById[props.aggressorId],
      defender: gameLoader.playersById[props.defenderId],
    });
  },
};

activeModuleData.scripts.add(
  {
    diplomacy:
    {
      onWarDeclaration:
      [
        {
          key: "makeWarDeclarationNotification",
          priority: 0,
          script: (aggressor, defender) =>
          {
            activeNotificationLog.makeNotification(
            {
              template: warDeclarationNotification,
              props:
              {
                aggressor: aggressor,
                defender: defender,
              },
              involvedPlayers: [aggressor, defender],
              location: null,
            });
          },
        },
      ],
    },
  });

export default warDeclarationNotification;
