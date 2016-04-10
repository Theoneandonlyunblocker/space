/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationlog.ts" />
/// <reference path="notificationlog.ts" />


import NotificationLog from "./NotificationLog.ts";


export interface PropTypes
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
  // TODO refactor | add state type
}

class Notifications extends React.Component<PropTypes, StateType>
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

const Factory: React.Factory<PropTypes> = React.createFactory(Notifications);
export default Factory;
