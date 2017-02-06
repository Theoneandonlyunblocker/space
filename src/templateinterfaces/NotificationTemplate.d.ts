/// <reference path="../../lib/react-global.d.ts" />

import GameLoader from "../GameLoader";
import NotificationFilterState from "../NotificationFilterState";

declare interface NotificationTemplate
{
  key: string;
  displayName: string;
  category: string;
  defaultFilterState: NotificationFilterState[];
  iconSrc: string;
  eventListeners: string[];
  contentConstructor: React.Factory<any>;
  messageConstructor: (props: any) => string;

  serializeProps: (props: any) => any;
  deserializeProps: (dataProps: any, gameLoader: GameLoader) => any;
}

export default NotificationTemplate;
