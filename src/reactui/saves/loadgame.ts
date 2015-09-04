/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="savelist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var LoadGame = React.createClass(
    {
      displayName: "LoadGame",

      componentDidMount: function()
      {
        this.refs.okButton.getDOMNode().focus();
      },

      setInputText: function(newText: string)
      {
        this.refs.saveName.getDOMNode().value = newText;
      },

      handleRowChange: function(row: IListItem)
      {
        this.setInputText(row.data.name)
      },

      handleLoad: function(e: Event)
      {
        var saveName = this.refs.saveName.getDOMNode().value

        this.handleClose();

        // https://github.com/facebook/react/issues/2988
        // https://github.com/facebook/react/issues/2605#issuecomment-118398797
        // without this react will keep a reference to this element causing a big memory leak
        var target = <HTMLButtonElement> e.target;
        target.blur();
        window.setTimeout(function()
        {
          app.load(saveName);
        }, 0);
      },
      handleClose: function()
      {
        this.props.handleClose();
      },
      makeConfirmDeletionPopup: function(saveName: string)
      {
        var deleteFN = function(saveName: string)
        {
          localStorage.removeItem(saveName);
          this.refs.saveName.getDOMNode().value = "";
          this.forceUpdate();
        }.bind(this, saveName);

        var confirmProps =
        {
          handleOk: deleteFN,
          contentText: "Are you sure you want to delete the save " +
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
              ref: "popupManager",
              onlyAllowOne: true
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
                onClick: this.handleLoad,
                ref: "okButton"
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