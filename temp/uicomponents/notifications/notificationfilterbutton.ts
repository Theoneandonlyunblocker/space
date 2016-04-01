/// <reference path="../../notificationfilter.ts" />
/// <reference path="notificationfilterlist.ts" />

export interface PropTypes
{
  filter: NotificationFilter;
  text: string;
  highlightedOptionKey?: string;
}

export var NotificationFilterButton = React.createFactory(React.createClass(
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
}));
