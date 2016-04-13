/// <reference path="../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import NotificationFilterState from "../NotificationFilterState";
import GameLoader from "../GameLoader";

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
