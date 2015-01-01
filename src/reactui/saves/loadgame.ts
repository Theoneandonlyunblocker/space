/// <reference path="savelist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var LoadGame = React.createClass(
    {
      displayName: "LoadGame",

      setInputText: function(newText)
      {
        this.refs.saveName.getDOMNode().value = newText;
      },

      handleRowChange: function(row)
      {
        this.setInputText(row.data.name)
      },

      handleLoad: function()
      {
        app.load(this.refs.saveName.getDOMNode().value);
        this.handleClose();
      },
      handleClose: function()
      {
        this.props.handleClose();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "save-game"
          },
            UIComponents.SaveList(
            {
              onRowChange: this.handleRowChange
            }),
            React.DOM.input(
            {
              className: "save-game-name",
              ref: "saveName",
              type: "text"
            }),
            React.DOM.div(
            {
              className: "save-game-buttons-container"
            },
              React.DOM.button(
              {
                className: "save-game-button",
                onClick: this.handleLoad
              }, "Load"),
              React.DOM.button(
              {
                className: "save-game-button",
                onClick: this.handleClose
              }, "Cancel")
            )
          )
        );
      }
    });
  }
}