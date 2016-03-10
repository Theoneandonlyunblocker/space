/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />

module Rance
{
  export module UIComponents
  {
    export var NotificationFilterButton = React.createClass(
    {
      displayName: "NotificationFilterButton",
      propTypes:
      {
        filter: React.PropTypes.instanceOf(Rance.NotificationFilter).isRequired,
        text: React.PropTypes.string.isRequired,
        highlightedOptionKey: React.PropTypes.string
      },

      getInitialState: function()
      {
        return(
        {
          notificationFilterPopup: undefined
        });
      },
      
      makePopup: function()
      {
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
            minHeight: 150
          }
        });

        this.setState(
        {
          notificationFilterPopup: popupId
        });
      },

      closePopup: function()
      {
        this.refs.popupManager.closePopup(this.state.notificationFilterPopup);
        this.setState(
        {
          notificationFilterPopup: undefined
        });
      },

      togglePopup: function()
      {
        if (isFinite(this.state.notificationFilterPopup))
        {
          this.closePopup();
        }
        else
        {
          this.makePopup();
        }
      },

      render: function()
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
    })
  }
}
