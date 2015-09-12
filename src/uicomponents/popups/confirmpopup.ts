module Rance
{
  export module UIComponents
  {
    export var ConfirmPopup = React.createClass(
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
        return(
          React.DOM.div(
          {
            className: "confirm-popup"
          },
            React.DOM.div(
            {
              className: "confirm-popup-content"
            },
              this.splitMultilineText(this.props.contentText)
            ),
            React.DOM.div(
            {
              className: "popup-buttons"
            },
              React.DOM.button(
              {
                className: "popup-button",
                onClick: this.handleOk,
                ref: "okButton"
              }, this.props.okText || "Confirm"),
              React.DOM.button(
              {
                className: "popup-button",
                onClick: this.handleClose
              }, this.props.cancelText || "Cancel")
            )
          )
        );
      }
    });
  }
}