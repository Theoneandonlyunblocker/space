/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />

export interface PropTypes
{
  filter: NotificationFilter;
  text: string;
  highlightedOptionKey?: string;
}

interface StateType
{
  // TODO refactor | add state type
}

class NotificationFilterButton extends React.Component<PropTypes, StateType>
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
      contentConstructor: UIComponents.TopMenuPopup,
      contentProps:
      {
        contentConstructor: UIComponents.NotificationFilterList,
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
        UIComponents.PopupManager(
        {
          ref: "popupManager",
          onlyAllowOne: true
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterButton);
export default Factory;
