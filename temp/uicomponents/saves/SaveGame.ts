/// <reference path="../../../lib/react-0.13.3.d.ts" />
import ListItem from "../../../temp/uicomponents/unitlist/ListItem.d.ts"; // TODO refactor | autogenerated

import app from "../../../src/App.ts"; // TODO refactor | autogenerated
import * as React from "react";

/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="savelist.ts"/>


import SaveList from "./SaveList.ts";
import PopupManager from "../popups/PopupManager.ts";
import ConfirmPopup from "../popups/ConfirmPopup.ts";


export interface PropTypes extends React.Props<any>
{
  handleClose: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  okButton: HTMLElement;
  popupManager: React.Component<any, any>; // PopupManager
  saveName: HTMLElement;
}

class SaveGame_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "SaveGame";

  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentDidMount()
  {
    if (app.game.gameStorageKey)
    {
      React.findDOMNode<HTMLElement>(this.refs.okButton).focus();
    }
    else
    {
      React.findDOMNode<HTMLElement>(this.refs.saveName).focus();
    }
  }

  setInputText(newText: string)
  {
    React.findDOMNode<HTMLInputElement>(this.refs.saveName).value = newText;
  }

  handleRowChange(row: ListItem)
  {
    this.setInputText(row.data.name)
  }

  handleSave()
  {
    var saveName = React.findDOMNode<HTMLInputElement>(this.refs.saveName).value
    var saveKey = "Save." + saveName;
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
    app.game.save(React.findDOMNode<HTMLInputElement>(this.refs.saveName).value);
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
        saveName.replace("Save.", "") + "?"
    }

    this.refs.popupManager.makePopup(
    {
      contentConstructor: ConfirmPopup,
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
        PopupManager(
        {
          ref: "popupManager",
          onlyAllowOne: true
        }),
        SaveList(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SaveGame_COMPONENT_TODO);
export default Factory;
