import {GameLoader} from "core/src/saves/GameLoader";
import {Player} from "core/src/player/Player";
import {NotificationFilterState} from "core/src/notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "core/src/notifications/NotificationWitnessCriterion";
import {activeNotificationStore} from "core/src/app/activeNotificationStore";
import {NotificationTemplate} from "core/src/templateinterfaces/NotificationTemplate";
import {localize, localizeString} from "../../localization/localize";
import { getIcon } from "../../assets/assets";

import {WarDeclarationNotification as UIComponent} from "./uicomponents/WarDeclarationNotification";


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

export const warDeclarationNotification: NotificationTemplate<PropTypes, SerializedPropTypes> =
{
  key: "warDeclarationNotification",
  get displayName()
  {
    return localizeString("warDeclarationNotification_displayName");
  },
  get category()
  {
    return localizeString("notificationCategory_diplomacy");
  },
  defaultFilterState: [NotificationFilterState.ShowIfInvolved],
  witnessCriteria:
  [
    [NotificationWitnessCriterion.IsInvolved],
    [NotificationWitnessCriterion.MetAllInvolvedPlayers],
  ],
  getIcon: (props: PropTypes) =>
  {
    const icon = getIcon("crossed-swords", props.aggressor.id, props.defender.id);
    icon.foreground.style.fill = "transparent";
    icon.gradientStop1.style.stopColor = `#${props.aggressor.color.getHexString()}`;
    icon.gradientStop2.style.stopColor = `#${props.defender.color.getHexString()}`;
    icon.background.style.fill = `url(#${icon.gradient.id})`;

    return icon.element;
  },
  contentConstructor: UIComponent,
  messageConstructor: (props: PropTypes) =>
  {
    return localize("warDeclarationMessage").format(
    {
      aggressorName: props.aggressor.name,
      defenderName: props.defender.name,
    });
  },
  getTitle: (props: PropTypes) => localize("warDeclarationTitle").toString(),
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

export const warDeclarationNotificationCreationScripts =
{
  diplomacy:
  {
    onWarDeclaration:
    [
      {
        key: "makeWarDeclarationNotification",
        triggerPriority: 0,
        script: (aggressor: Player, defender: Player) =>
        {
          activeNotificationStore.makeNotification<PropTypes, SerializedPropTypes>(
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
};
