/// <reference path="../../../lib/react-global.d.ts" />

import NotificationLog from "../../NotificationLog";

import {Language} from "../../localization/Language";

import NotificationLogComponentFactory from "./NotificationLog";


export interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
  activeLanguage: Language;
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
        className: "notifications-container",
      },
        NotificationLogComponentFactory(
        {
          log: this.props.log,
          currentTurn: this.props.currentTurn,
          activeLanguage: this.props.activeLanguage,
          key: "log",
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationsComponent);
export default Factory;
