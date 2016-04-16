/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />


import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import NotificationFilterList from "./NotificationFilterList";
import NotificationFilter from "../../NotificationFilter";
import TopMenuPopup from "../popups/TopMenuPopup";


interface PropTypes extends React.Props<any>
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
  ref_TODO_popupManager: PopupManagerComponent;

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
    var scrollToHighlightedFN = function()
    {
      const popup = this.popupComponentsByID[this.popupId - 1];
      var content = popup.ref_TODO_content.ref_TODO_content;
      content.scrollToHighlighted();
    }.bind(this.ref_TODO_popupManager);

    var popupId = this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: TopMenuPopup,
      contentProps:
      {
        contentConstructor: NotificationFilterList,
        contentProps:
        {
          filter: this.props.filter,
          highlightedOptionKey: this.props.highlightedOptionKey
        },
        handleClose: this.closePopup
      },
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
    this.ref_TODO_popupManager.closePopup(this.state.notificationFilterPopup);
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
            this.ref_TODO_popupManager = component;
          },
          onlyAllowOne: true
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButtonComponent);
export default Factory;
