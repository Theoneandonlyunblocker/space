import * as React from "react";

import GameLoader from "../GameLoader";

import {NotificationFilterState} from "../notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "../notifications/NotificationWitnessCriterion";


declare interface NotificationTemplate<P, D>
{
  key: string;
  displayName: string;
  category: string;
  defaultFilterState: NotificationFilterState[];
  /*
    if any outer elements are true
      [[isInvolved], [locationIsVisible]] => involved OR visible
    if all inner elements are true
      [[isInvolved, locationIsVisible]] => involved AND visible
  */
  witnessCriteria: NotificationWitnessCriterion[][];
  // TODO 2018.12.20 | return element instead
  getIconSrc: () => string;
  contentConstructor: React.Factory<any>;
  messageConstructor: (props: P) => string;
  getTitle: (props: P) => string;

  serializeProps: (props: P) => D;
  deserializeProps: (dataProps: D, gameLoader: GameLoader) => P;
}

export default NotificationTemplate;
