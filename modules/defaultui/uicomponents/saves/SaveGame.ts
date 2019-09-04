import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../localization/localize";
import {app} from "../../../../src/app/App"; // TODO global
import {storageStrings} from "../../../../src/saves/storageStrings";
import {ListItem} from "../list/ListItem";
import {DialogBox} from "../windows/DialogBox";

import {SaveList} from "./SaveList";
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
    saveName: app.game.gameStorageKey ?
      app.game.gameStorageKey.replace(storageStrings.savePrefix, "") :
      "",
    hasConfirmOverwritePopup: false,
  };

  private readonly okButtonElement = React.createRef<HTMLButtonElement>();
  private readonly saveNameElement = React.createRef<HTMLInputElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }

  public componentDidMount()
  {
    if (this.state.saveName)
    {
      this.okButtonElement.current.focus();
    }
    else
    {
      this.saveNameElement.current.focus();
    }
  }
  public render()
  {
    const saveNameInputHtmlName = "save-name";

    return(
      ReactDOMElements.div(
      {
        className: "save-game",
      },
        !this.state.hasConfirmOverwritePopup ? null :
          DialogBox(
          {
            title: localize("confirmOverwrite").toString(),
            handleOk: this.saveGame,
            handleCancel: this.closeConfirmOverwritePopup,
          },
            localize("promptOverwrite").format(
            {
              toOverWrite: this.state.saveName,
            }),
          ),
        SaveList(
        {
          onRowChange: this.handleRowChange,
          selectedKey: this.getCurrentSaveKey(),
          onDoubleClick: this.saveGame,
        }),
        ReactDOMElements.form(
        {
          className: "save-game-form",
          onSubmit: this.handleSave,
          action: "javascript:void(0);",
        },
          ReactDOMElements.label(
          {
            className: "save-game-name-label",
            htmlFor: saveNameInputHtmlName,
          },
            `${localize("saveName")}:`,
          ),
          ReactDOMElements.input(
          {
            className: "save-game-name",
            name: saveNameInputHtmlName,
            ref: this.saveNameElement,
            type: "text",
            value: this.state.saveName,
            onChange: this.handleSaveNameInput,
            maxLength: 64,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "save-game-buttons-container",
        },
          ReactDOMElements.button(
          {
            className: "save-game-button",
            onClick: this.handleSave,
            disabled: !this.state.saveName,
            ref: this.okButtonElement,
          }, localize("save_action").toString()),
          ReactDOMElements.button(
          {
            className: "save-game-button",
            onClick: this.handleClose,
          }, localize("cancel").toString()),
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
    const saveKey = this.getCurrentSaveKey();

    localForage.getItem(saveKey).then(item =>
    {
      if (item)
      {
        this.setState({hasConfirmOverwritePopup: true});
      }
      else
      {
        this.saveGame();
      }
    });
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
  private getCurrentSaveKey(): string
  {
    const saveName = this.state.saveName;

    return storageStrings.savePrefix + saveName;
  }
}

export const SaveGame: React.Factory<PropTypes> = React.createFactory(SaveGameComponent);
