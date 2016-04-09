/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationlog.ts" />
/// <reference path="notificationlog.ts" />

export interface PropTypes
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
  // TODO refactor | add state type
}

export default class Notifications extends React.Component<PropTypes, StateType>
{
  displayName: string = "Notifications";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "notifications-container"
      },
        UIComponents.NotificationLog(
        {
          log: this.props.log,
          currentTurn: this.props.currentTurn,
          key: "log"
        })
      )
    );
  }
}
