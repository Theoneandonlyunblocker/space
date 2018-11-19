import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import {default as DialogBox} from "../windows/DialogBox";

import ConfirmDeleteSavesContent from "./ConfirmDeleteSavesContent";
import SaveList, { SaveListComponent } from "./SaveList";
import { storageStrings } from "../../storageStrings";


export interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
}

interface StateType
{
  saveKeysToDelete: string[];
  selectedSaveKey: string | null;
  hasConfirmDeleteSavePopup: boolean;
}

export class LoadGameComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "LoadGame";
  public state: StateType;

  private saveList = React.createRef<SaveListComponent>();
  private loadButtonElement = React.createRef<HTMLButtonElement>();
  private afterConfirmDeleteCallback: () => void;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      saveKeysToDelete: [],
      selectedSaveKey: null,
      hasConfirmDeleteSavePopup: false,
    };

    this.bindMethods();
  }

  public componentDidMount()
  {
    this.loadButtonElement.current.focus();
  }
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "save-game",
      },
        !this.state.hasConfirmDeleteSavePopup ? null :
          DialogBox(
          {
            title: localize("confirmDeletion")(),
            handleOk: () =>
            {
              this.deleteSelectedKeys();
              this.closeConfirmDeleteSavesPopup();

              this.saveList.current.updateAvailableSaves();
            },
            handleCancel: this.closeConfirmDeleteSavesPopup,
          },
            ConfirmDeleteSavesContent(
            {
              saveNames: this.state.saveKeysToDelete,
            }),
          ),
        SaveList(
        {
          ref: this.saveList,
          onRowChange: row =>
          {
            this.setState({selectedSaveKey: row.content.props.storageKey});

            this.handleUndoMarkForDeletion(row.content.props.storageKey);
          },
          autoSelect: !Boolean(app.game.gameStorageKey),
          selectedKey: app.game.gameStorageKey,
          allowDeletion: true,
          onMarkForDeletion: this.handleMarkForDeletion,
          onUndoMarkForDeletion: this.handleUndoMarkForDeletion,
          saveKeysMarkedForDeletion: this.state.saveKeysToDelete,
          onDoubleClick: this.handleLoad,
        }),
        ReactDOMElements.form(
        {
          className: "save-game-form",
          onSubmit: this.handleLoad,
          action: "javascript:void(0);",
        },
          ReactDOMElements.input(
          {
            className: "save-game-name",
            type: "text",
            value: this.state.selectedSaveKey ? this.state.selectedSaveKey.replace(storageStrings.savePrefix, "") : "",
            readOnly: true,
          }),
        ),
        ReactDOMElements.div(
        {
          className: "save-game-buttons-container",
        },
          ReactDOMElements.button(
          {
            className: "save-game-button",
            onClick: this.handleLoad,
            ref: this.loadButtonElement,
          }, localize("load_action")()),
          ReactDOMElements.button(
          {
            className: "save-game-button",
            onClick: this.handleClose.bind(this, true, null),
          }, localize("cancel")()),
          ReactDOMElements.button(
          {
            className: "save-game-button",
            onClick: this.openConfirmDeleteSavesPopup,
            disabled: this.state.saveKeysToDelete.length < 1,
          },
            localize("delete")(),
          ),
        ),
      )
    );
  }
  public openConfirmDeleteSavesPopup(): void
  {
    this.setState({hasConfirmDeleteSavePopup: true});
  }

  private bindMethods()
  {
    this.handleLoad = this.handleLoad.bind(this);
    this.deleteSelectedKeys = this.deleteSelectedKeys.bind(this);
    this.handleMarkForDeletion = this.handleMarkForDeletion.bind(this);
    this.handleUndoMarkForDeletion = this.handleUndoMarkForDeletion.bind(this);
    this.openConfirmDeleteSavesPopup = this.openConfirmDeleteSavesPopup.bind(this);
    this.closeConfirmDeleteSavesPopup = this.closeConfirmDeleteSavesPopup.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  private handleLoad()
  {
    app.load(this.state.selectedSaveKey);
  }
  private deleteSelectedKeys()
  {
    this.state.saveKeysToDelete.forEach(key =>
    {
      localForage.removeItem(key);
    });

    this.setState(
    {
      selectedSaveKey: this.state.saveKeysToDelete.indexOf(this.state.selectedSaveKey) !== -1 ?
        null :
        this.state.selectedSaveKey,
      saveKeysToDelete: [],
    }, () =>
    {
      if (this.afterConfirmDeleteCallback)
      {
        const afterConfirmDeleteCallback = this.afterConfirmDeleteCallback;
        this.afterConfirmDeleteCallback = undefined;
        afterConfirmDeleteCallback();
      }
    });
  }
  private handleMarkForDeletion(saveKey: string): void
  {
    this.setState(
    {
      saveKeysToDelete: this.state.saveKeysToDelete.concat(saveKey),
    });
  }
  private handleUndoMarkForDeletion(saveKey: string): void
  {
    this.setState(
    {
      saveKeysToDelete: this.state.saveKeysToDelete.filter(currentKey =>
      {
        return currentKey !== saveKey;
      }),
    });
  }
  private closeConfirmDeleteSavesPopup(): void
  {
    this.setState({hasConfirmDeleteSavePopup: false});
  }
  private handleClose(): void
  {
    this.props.handleClose();
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(LoadGameComponent);
export default factory;
