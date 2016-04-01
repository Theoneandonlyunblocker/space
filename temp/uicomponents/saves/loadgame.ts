/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="savelist.ts"/>

export var LoadGame = React.createFactory(React.createClass(
{
  displayName: "LoadGame",
  popupId: undefined,

  getInitialState: function()
  {
    return(
    {
      saveKeysToDelete: [],
      saveKey: null
    });
  },
  
  componentDidMount: function()
  {
    this.refs.okButton.getDOMNode().focus();
  },

  handleRowChange: function(row: IListItem)
  {
    this.setState(
    {
      saveKey: row.data.storageKey
    });
    this.handleUndoDelete(row.data.storageKey);
  },
  handleLoad: function()
  {
    var saveKey = this.state.saveKey;

    var afterConfirmFN = function()
    {
      // https://github.com/facebook/react/issues/2988
      // https://github.com/facebook/react/issues/2605#issuecomment-118398797
      // without this react will keep a reference to this element causing a big memory leak
      this.refs.okButton.getDOMNode().blur();
      window.setTimeout(function()
      {
        app.load(saveKey);
      }, 5);
    }.bind(this);

    if (this.state.saveKeysToDelete.indexOf(saveKey) !== -1)
    {
      var boundClose = this.handleClose.bind(this, true, afterConfirmFN);
      this.handleUndoDelete(saveKey, boundClose);
    }
    else
    {
      this.handleClose(true, afterConfirmFN);
    }
  },
  deleteSelectedKeys: function()
  {
    this.popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.ConfirmPopup,
      contentProps: this.getClosePopupContent(null, false, false)
    });
  },
  getClosePopupContent: function(afterCloseCallback?: Function, shouldCloseParent: boolean = true,
    shouldUndoAll: boolean = false)
  {
    var deleteFN = function()
    {
      for (var i = 0; i < this.state.saveKeysToDelete.length; i++)
      {
        localStorage.removeItem(this.state.saveKeysToDelete[i]);
      }

      this.setState(
      {
        saveKeysToDelete: []
      });
    }.bind(this);
    var closeFN = function()
    {
      this.popupId = undefined;
      if (shouldCloseParent)
      {
        this.props.handleClose();
      }
      if (shouldUndoAll)
      {
        this.setState(
        {
          saveKeysToDelete: []
        });
      }
      if (afterCloseCallback) afterCloseCallback();
    }.bind(this);

    var confirmText = ["Are you sure you want to delete the following saves?"];
    confirmText  = confirmText.concat(this.state.saveKeysToDelete.map(function(saveKey: string)
    {
      return saveKey.replace("Rance.Save.", "");
    }));

    return(
    {
      handleOk: deleteFN,
      handleClose: closeFN,
      contentText: confirmText
    });
  },
  updateClosePopup: function()
  {
    if (isFinite(this.popupId))
    {
      this.refs.popupManager.setPopupContent(this.popupId,
        {contentText: this.getClosePopupContent().contentText});
    }
    else if (this.state.saveKeysToDelete.length < 1)
    {
      if (isFinite(this.popupID)) this.refs.popupManager.closePopup(this.popupId);
      this.popupId = undefined;
    }
  },
  handleClose: function(deleteSaves: boolean = true, afterCloseCallback?: Function)
  {
    if (!deleteSaves || this.state.saveKeysToDelete.length < 1)
    {
      this.props.handleClose();
      if (afterCloseCallback) afterCloseCallback();
      return;
    }

    this.popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.ConfirmPopup,
      contentProps: this.getClosePopupContent(afterCloseCallback, true, true)
    });
  },
  handleDelete: function(saveKey: string)
  {
    this.setState(
    {
      saveKeysToDelete: this.state.saveKeysToDelete.concat(saveKey)
    }, this.updateClosePopup);
  },
  handleUndoDelete: function(saveKey: string, callback?: Function)
  {
    var afterDeleteFN = function()
    {
      this.updateClosePopup();
      if (callback) callback();
    }
    var i = this.state.saveKeysToDelete.indexOf(saveKey)
    if (i !== -1)
    {
      var newsaveKeysToDelete = this.state.saveKeysToDelete.slice(0);
      newsaveKeysToDelete.splice(i, 1);
      this.setState(
      {
        saveKeysToDelete: newsaveKeysToDelete
      }, afterDeleteFN);
    }
  },
  overRideLightBoxClose: function()
  {
    this.handleClose();
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
          autoSelect: !Boolean(app.game.gameStorageKey),
          selectedKey: app.game.gameStorageKey,
          allowDelete: true,
          onDelete: this.handleDelete,
          onUndoDelete: this.handleUndoDelete,
          saveKeysToDelete: this.state.saveKeysToDelete
        }),
        React.DOM.input(
        {
          className: "save-game-name",
          type: "text",
          value: this.state.saveKey ? this.state.saveKey.replace("Rance.Save.", "") : "",
          readOnly: true
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
            onClick: this.handleClose.bind(this, true, null)
          }, "Cancel"),
          React.DOM.button(
          {
            className: "save-game-button",
            onClick: this.deleteSelectedKeys,
            disabled: this.state.saveKeysToDelete.length < 1
          },
            "Delete"
          )
        )
      )
    );
  }
}));
