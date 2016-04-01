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

export default class NotificationFilterButton extends React.Component<PropTypes, {}>
{
  displayName: string = "NotificationFilterButton";

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      notificationFilterPopup: undefined
    });
  }
  
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  closePopup()
  {
    this.refs.popupManager.closePopup(this.state.notificationFilterPopup);
    this.setState(
    {
      notificationFilterPopup: undefined
    });
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
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
