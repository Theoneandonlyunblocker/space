/// <reference path="../../../lib/react-global-0.13.3.d.ts" />


import NotificationLog from "../../NotificationLog";
import Notifications from "../../../modules/defaultnotifications/NotificationTemplates";
import NotificationLogComponentFactory from "./NotificationLog";


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
        NotificationLogComponentFactory(
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
