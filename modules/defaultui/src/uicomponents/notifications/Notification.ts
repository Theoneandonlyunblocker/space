import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Notification as NotificationObj} from "core/src/notifications/Notification";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  markAsRead: (notification: NotificationObj) => void;
  notification: NotificationObj;
  togglePopup: (notification: NotificationObj) => void;
}

interface StateType
{
}

export class NotificationComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Notification";
  public override state: StateType;

  private readonly iconContainer = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  public override componentDidMount(): void
  {
    this.setIconContent();
  }
  public override componentDidUpdate(): void
  {
    this.setIconContent();
  }
  public override render()
  {
    return(
      ReactDOMElements.li(
      {
        className: "notification",
        onClick: this.handleClick,
        onContextMenu: this.handleRightClick,
        title: localize("notificationToolTip").toString(),
      },
        ReactDOMElements.div(
        {
          className: "notification-image",
          ref: this.iconContainer,
        }),
        ReactDOMElements.span(
        {
          className: "notification-message",
        },
          this.props.notification.makeMessage(),
        ),
      )
    );
  }

  private handleClose()
  {
    this.props.markAsRead(this.props.notification);
  }
  private handleClick()
  {
    this.props.togglePopup(this.props.notification);
  }
  private handleRightClick(e: React.MouseEvent<HTMLLIElement>)
  {
    e.preventDefault();
    e.stopPropagation();
    this.handleClose();
  }
  private setIconContent(): void
  {
    const container = this.iconContainer.current;
    while (container.firstChild)
    {
      container.removeChild(container.firstChild);
    }

    container.appendChild(this.props.notification.template.getIcon(this.props.notification.props));
  }
}

export const Notification: React.Factory<PropTypes> = React.createFactory(NotificationComponent);
