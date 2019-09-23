import * as React from "react";

import {GameLoader} from "../saves/GameLoader";

import {NotificationFilterState} from "../notifications/NotificationFilterState";
import {NotificationWitnessCriterion} from "../notifications/NotificationWitnessCriterion";


export interface NotificationTemplate<P, D>
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
  contentConstructor: React.Factory<any>;
  messageConstructor: (props: P) => string;
  getTitle: (props: P) => string;
  getIcon: (props: P) => HTMLElement | SVGElement;

  serializeProps: (props: P) => D;
  deserializeProps: (dataProps: D, gameLoader: GameLoader) => P;
}
