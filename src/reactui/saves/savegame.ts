/// <reference path="savelist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var SaveGame = React.createClass(
    {
      displayName: "SaveGame",

      setInputText: function(newText)
      {
        this.refs.saveName.getDOMNode().value = newText;
      },

      handleRowChange: function(row)
      {
        this.setInputText(row.data.name)
      },

      handleSave: function()
      {
        var saveName = this.refs.saveName.getDOMNode().value
        var saveKey = "Rance.Save." + saveName;
        if (localStorage[saveKey])
        {
          this.makeConfirmOverWritePopup(saveName)
        }
        else
        {
          this.saveGame();
        }
      },
      saveGame: function()
      {
        app.game.save(this.refs.saveName.getDOMNode().value);
        this.handleClose();
      },
      handleClose: function()
      {
        this.props.handleClose();
      },
      makeConfirmOverWritePopup: function(saveName: string)
      {
        var confirmProps =
        {
          handleOk: this.saveGame,
          contentText: "Are you sure you want to overwrite " +
            saveName.replace("Rance.Save.", "") + "?"
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
              autoSelect: true
            }),
            React.DOM.input(
            {
              className: "save-game-name",
              ref: "saveName",
              type: "text",
              maxLength: 64
            }),
            React.DOM.div(
            {
              className: "save-game-buttons-container"
            },
              React.DOM.button(
              {
                className: "save-game-button",
                onClick: this.handleSave
              }, "Save"),
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