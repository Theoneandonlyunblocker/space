export namespace UIComponents
{
  export var ConfirmPopup = React.createFactory(React.createClass(
  {
    displayName: "ConfirmPopup",
    mixins: [SplitMultilineText],

    componentDidMount: function()
    {
      this.refs.okButton.getDOMNode().focus();
    },

    handleOk: function()
    {
      if (!this.props.handleOk)
      {
        this.handleClose();
        return;
      }
      
      var callbackSuccesful = this.props.handleOk();

      if (callbackSuccesful !== false)
      {
        this.handleClose();
      }
    },
    handleClose: function()
    {
      if (this.props.handleClose)
      {
        this.props.handleClose();
      }
      this.props.closePopup();
    },

    render: function()
    {
      var content: ReactComponentPlaceHolder;
      if (this.props.contentText)
      {
        content = this.splitMultilineText(this.props.contentText);
      }
      else if (this.props.contentConstructor)
      {
        content = this.props.contentConstructor(this.props.contentProps);
      }
      else
      {
        throw new Error("Confirm popup has no content");
      }

      return(
        React.DOM.div(
        {
          className: "confirm-popup draggable-container"
        },
          React.DOM.div(
          {
            className: "confirm-popup-content"
          },
            content
          ),
          React.DOM.div(
          {
            className: "popup-buttons draggable-container"
          },
            React.DOM.button(
            {
              className: "popup-button",
              onClick: this.handleOk,
              ref: "okButton"
            }, this.props.okText || "Confirm"),
            this.props.extraButtons,
            React.DOM.button(
            {
              className: "popup-button",
              onClick: this.handleClose
            }, this.props.cancelText || "Cancel")
          )
        )
      );
    }
  }));
}
