/// <reference path="../../lib/react-global.d.ts" />

import GameLoader from "../GameLoader";
import NotificationFilterState from "../NotificationFilterState";

declare interface NotificationTemplate<P, D>
{
  key: string;
  displayName: string;
  category: string;
  defaultFilterState: NotificationFilterState[];
  iconSrc: string;
  eventListeners: string[];
  contentConstructor: React.Factory<any>;
  messageConstructor: (props: P) => string;
  getTitle: (props: P) => string;

  serializeProps: (props: P) => D;
  deserializeProps: (dataProps: D, gameLoader: GameLoader) => P;
}

export default NotificationTemplate;
