/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />


import PopupManager from "../popups/PopupManager.ts";
import NotificationFilterList from "./NotificationFilterList.ts";
import NotificationFilter from "../../../src/NotificationFilter.ts";
import TopMenuPopup from "../popups/TopMenuPopup.ts";


export interface PropTypes extends React.Props<any>
{
  filter: NotificationFilter;
  text: string;
  highlightedOptionKey?: string;
}

interface StateType
{
  notificationFilterPopup: any; // TODO refactor | define state type 456
}

class NotificationFilterButton_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterButton";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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
      var popup = this.refs[this.popupId - 1];
      var content = popup.refs["content"].refs["content"];
      content.scrollToHighlighted();
    }.bind(this.refs.popupManager);

    var popupId = this.refs.popupManager.makePopup(
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
        containerDragOnly: true,
        preventAutoResize: true,
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
    this.refs.popupManager.closePopup(this.state.notificationFilterPopup);
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
          ref: "popupManager",
          onlyAllowOne: true
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButton_COMPONENT_TODO);
export default Factory;
