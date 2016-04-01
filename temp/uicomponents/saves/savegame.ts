/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="savelist.ts"/>

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class SaveGame extends React.Component<PropTypes, {}>
{
  displayName: string = "SaveGame";

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
  
  componentDidMount()
  {
    if (app.game.gameStorageKey)
    {
      this.refs.okButton.getDOMNode().focus();
    }
    else
    {
      this.refs.saveName.getDOMNode().focus();
    }
  }

  setInputText(newText: string)
  {
    this.refs.saveName.getDOMNode().value = newText;
  }

  handleRowChange(row: IListItem)
  {
    this.setInputText(row.data.name)
  }

  handleSave()
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
  }
  saveGame()
  {
    app.game.save(this.refs.saveName.getDOMNode().value);
    this.handleClose();
  }
  handleClose()
  {
    this.props.handleClose();
  }
  makeConfirmOverWritePopup(saveName: string)
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
  }

  render()
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
          selectedKey: app.game.gameStorageKey,
          autoSelect: false
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
            onClick: this.handleSave,
            ref: "okButton"
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
}
