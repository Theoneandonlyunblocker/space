/// <reference path="../../lib/react-global.d.ts" />

import GameLoader from "../GameLoader";
import NotificationFilterState from "../NotificationFilterState";
import {NotificationWitnessCriteria} from "../NotificationWitnessCriteria";


declare interface NotificationTemplate<P, D>
{
  key: string;
  displayName: string;
  category: string;
  defaultFilterState: NotificationFilterState[];
  /*
    use separate array elements for logical OR
      [isInvolved, locationIsVisible] => involved OR visible
    use bitwise OR for logical AND
      [isInvolved | locationIsVisible] => involved AND visible
  */
  witnessCriteria: NotificationWitnessCriteria[];
  iconSrc: string;
  contentConstructor: React.Factory<any>;
  messageConstructor: (props: P) => string;
  getTitle: (props: P) => string;

  serializeProps: (props: P) => D;
  deserializeProps: (dataProps: D, gameLoader: GameLoader) => P;
}

export default NotificationTemplate;
