/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />


import PopupManager from "../popups/PopupManager.ts";
import NotificationFilterList from "./NotificationFilterList.ts";
import NotificationFilter from "../../../src/NotificationFilter.ts";
import TopMenuPopup from "../popups/TopMenuPopup.ts";


interface PropTypes extends React.Props<any>
{
  filter: NotificationFilter;
  text: string;
  highlightedOptionKey?: string;
}

interface StateType
{
  notificationFilterPopup?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

export class NotificationFilterButtonComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterButton";

  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);    
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
      var popup = this.refsTODO[this.popupId - 1];
      var content = popup.refs["content"].refs["content"];
      content.scrollToHighlighted();
    }.bind(this.refsTODO.popupManager);

    var popupId = this.refsTODO.popupManager.makePopup(
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
    this.refsTODO.popupManager.closePopup(this.state.notificationFilterPopup);
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

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButtonComponent);
export default Factory;
