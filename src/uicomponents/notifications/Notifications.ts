/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationlog.ts" />
/// <reference path="notificationlog.ts" />


import Notifications from "../../../modules/defaultnotifications/NotificationTemplates";
import NotificationLog from "./NotificationLog";


interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
}

export class NotificationsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Notifications";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "notifications-container"
      },
        NotificationLog(
        {
          log: this.props.log,
          currentTurn: this.props.currentTurn,
          key: "log"
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationsComponent);
export default Factory;
