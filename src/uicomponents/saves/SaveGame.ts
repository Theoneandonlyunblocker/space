import * as React from "react";
import * as ReactDOM from "react-dom";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import ListItem from "../list/ListItem";
import {default as DialogBox} from "../windows/DialogBox";

import SaveList from "./SaveList";
import {PropTypes as SaveListItemProps} from "./SaveListItem";


export interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
}

interface StateType
{
  saveName: string;
  hasConfirmOverwritePopup: boolean;
}

export class SaveGameComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "SaveGame";
  public state: StateType =
  {
    saveName: "",
    hasConfirmOverwritePopup: false,
  };

  private okButtonElement: HTMLElement | null;
  private saveNameElement: HTMLElement | null;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }

  public componentDidMount()
  {
    if (app.game.gameStorageKey)
    {
      ReactDOM.findDOMNode<HTMLElement>(this.okButtonElement!).focus();
    }
    else
    {
      ReactDOM.findDOMNode<HTMLElement>(this.saveNameElement!).focus();
    }
  }
  public render()
  {
    return(
      React.DOM.div(
      {
        className: "save-game",
      },
        !this.state.hasConfirmOverwritePopup ? null :
          DialogBox(
          {
            title: localize("confirmOverwrite")(),
            handleOk: this.saveGame,
            handleCancel: this.closeConfirmOverwritePopup,
          },
            localize("promptOverwrite")(
            {
              toOverWrite: this.state.saveName.replace("Rance.Save.", "")
            }),
          ),
        SaveList(
        {
          onRowChange: this.handleRowChange,
          selectedKey: app.game.gameStorageKey,
          autoSelect: false,
          onDoubleClick: this.saveGame,
        }),
        React.DOM.form(
        {
          className: "save-game-form",
          onSubmit: this.handleSave,
          action: "javascript:void(0);",
        },
          React.DOM.input(
          {
            className: "save-game-name",
            ref: (component: HTMLElement | null) =>
            {
              this.saveNameElement = component;
            },
            type: "text",
            value: this.state.saveName,
            onChange: this.handleSaveNameInput,
            maxLength: 64,
          }),
        ),
        React.DOM.div(
        {
          className: "save-game-buttons-container",
        },
          React.DOM.button(
          {
            className: "save-game-button",
            onClick: this.handleSave,
            ref: (component: HTMLElement | null) =>
            {
              this.okButtonElement = component;
            },
          }, localize("save_action")()),
          React.DOM.button(
          {
            className: "save-game-button",
            onClick: this.handleClose,
          }, localize("cancel")()),
        ),
      )
    );
  }

  private bindMethods()
  {
    this.handleClose = this.handleClose.bind(this);
    this.setSaveName = this.setSaveName.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleSaveNameInput = this.handleSaveNameInput.bind(this);
    this.closeConfirmOverwritePopup = this.closeConfirmOverwritePopup.bind(this);
  }
  private setSaveName(newText: string)
  {
    this.setState(
    {
      saveName: newText,
    });
  }
  private handleSaveNameInput(e: React.FormEvent<HTMLInputElement>)
  {
    const target = e.currentTarget;
    this.setSaveName(target.value);
  }
  private handleRowChange(row: ListItem<SaveListItemProps>)
  {
    this.setSaveName(row.content.props.name);
  }
  private handleSave()
  {
    const saveName = this.state.saveName;
    const saveKey = "Rance.Save." + saveName;
    if (localStorage[saveKey])
    {
      this.setState({hasConfirmOverwritePopup: true});
    }
    else
    {
      this.saveGame();
    }
  }
  private closeConfirmOverwritePopup(): void
  {
    this.setState({hasConfirmOverwritePopup: false});
  }
  private saveGame()
  {
    app.game.save(this.state.saveName);
    this.handleClose();
  }
  private handleClose()
  {
    this.props.handleClose();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SaveGameComponent);
export default Factory;
