/// <reference path="../../../lib/react-global.d.ts" />

import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import NotificationFilterList from "./NotificationFilterList";
import NotificationFilter from "../../NotificationFilter";
import TopMenuPopup from "../popups/TopMenuPopup";


export interface PropTypes extends React.Props<any>
{
  filter: NotificationFilter;
  text: string;
  highlightedOptionKey?: string;
}

interface StateType
{
  notificationFilterPopup?: number;
}

export class NotificationFilterButtonComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterButton";

  state: StateType;
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      notificationFilterPopup: undefined
    });
  }
  
  makePopup()
  {
    // TODO | really ugly
    const scrollToHighlightedFN = function(this: PopupManagerComponent)
    {
      const popup = this.popupComponentsByID[this.popupId - 1];
      const outerContent = <any> popup.ref_TODO_content;
      const innerContent = <any> outerContent.ref_TODO_content;

      innerContent.scrollToHighlighted();
    }.bind(this.ref_TODO_popupManager);

    var popupId = this.ref_TODO_popupManager.makePopup(
    var popupId = this.popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        content: NotificationFilterList(
        {
          filter: this.props.filter,
          highlightedOptionKey: this.props.highlightedOptionKey
        }),
        handleClose: this.closePopup
      }),
      popupProps:
      {
        dragPositionerProps:
        {
          containerDragOnly: true,
          preventAutoResize: true,
        },
        resizable: true,
        minWidth: 440,
        minHeight: 150,
        finishedMountingCallback: scrollToHighlightedFN
      }
    });

    this.setState(
    {
      notificationFilterPopup: popupId
    });
  }

  closePopup()
  {
    this.popupManager.closePopup(this.state.notificationFilterPopup);
    this.setState(
    {
      notificationFilterPopup: undefined
    });
  }

  togglePopup()
  {
    if (isFinite(this.state.notificationFilterPopup))
    {
      this.closePopup();
    }
    else
    {
      this.makePopup();
    }
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "notification-filter-button-container"
      },
        React.DOM.button(
        {
          className: "notification-filter-button",
          onClick: this.togglePopup
        },
          this.props.text
        ),
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButtonComponent);
export default Factory;
