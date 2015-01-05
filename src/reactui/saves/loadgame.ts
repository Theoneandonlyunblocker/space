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
        var saveName = this.refs.saveName.getDOMNode().value

        this.handleClose();

        app.load(saveName);
      },
      handleClose: function()
      {
        this.props.handleClose();
      },
      makeConfirmDeletionPopup: function(saveName: string)
      {
        var confirmProps =
        {
          handleOk: localStorage.removeItem(saveName),
          contentText: "test"
        }

        this.refs.popupManager.makePopup(
        {
          contentConstructor: UIComponents.ConfirmPopup,
          contentProps: confirmProps
        });
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "save-game"
          },
            UIComponents.PopupManager(
            {
              ref: "popupManager"
            }),
            UIComponents.SaveList(
            {
              onRowChange: this.handleRowChange,
              autoSelect: true,
              allowDelete: true,
              onDelete: this.makeConfirmDeletionPopup
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