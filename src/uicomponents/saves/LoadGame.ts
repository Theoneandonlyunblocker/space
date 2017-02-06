/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global

import ConfirmDeleteSavesContent from "./ConfirmDeleteSavesContent";
import SaveList from "./SaveList";
import {PropTypes as SaveListItemProps} from "./SaveListItem";

import ListItem from "../list/ListItem";

import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import {default as ConfirmPopup, PropTypes as ConfirmPopupProps} from "../popups/ConfirmPopup";


export interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
}

interface StateType
{
  saveKeysToDelete?: string[];
  saveKey?: string;
}

export class LoadGameComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "LoadGame";
  popupID: number = undefined;

  state: StateType;
  ref_TODO_okButton: HTMLElement;
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleLoad = this.handleLoad.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateClosePopup = this.updateClosePopup.bind(this);
    this.overRideLightBoxClose = this.overRideLightBoxClose.bind(this);
    this.handleUndoDelete = this.handleUndoDelete.bind(this);
    this.deleteSelectedKeys = this.deleteSelectedKeys.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.getClosePopupContent = this.getClosePopupContent.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      saveKeysToDelete: [],
      saveKey: null
    });
  }

  componentDidMount()
  {
    ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_okButton).focus();
  }

  handleRowChange(row: ListItem<SaveListItemProps>)
  {
    this.setState(
    {
      saveKey: row.content.props.storageKey
    });
    this.handleUndoDelete(row.content.props.storageKey);
  }
  handleLoad()
  {
    var saveKey = this.state.saveKey;

    var afterConfirmFN = () =>
    {
      app.load(saveKey);
    };

    if (this.state.saveKeysToDelete.indexOf(saveKey) !== -1)
    {
      var boundClose = this.handleClose.bind(this, true, afterConfirmFN);
      this.handleUndoDelete(saveKey, boundClose);
    }
    else
    {
      this.handleClose(true, afterConfirmFN);
    }
  }
  deleteSelectedKeys()
  {
    this.popupID = this.popupManager.makePopup(
    {
      content: ConfirmPopup(this.getClosePopupContent(null, false, false)),
      popupProps:
      {
        dragPositionerProps:
        {
          preventAutoResize: true
        }
      }
    });
  }
  getClosePopupContent(afterCloseCallback?: Function, shouldCloseParent: boolean = true,
    shouldUndoAll: boolean = false): ConfirmPopupProps
  {
    var deleteFN = () =>
    {
      for (let i = 0; i < this.state.saveKeysToDelete.length; i++)
      {
        localStorage.removeItem(this.state.saveKeysToDelete[i]);
      }

      this.setState(
      {
        saveKeysToDelete: []
      });
    };
    var closeFN = () =>
    {
      this.popupID = undefined;
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
    };

    return(
    {
      handleOk: deleteFN,
      handleClose: closeFN,
      content: ConfirmDeleteSavesContent(
      {
        saveNames: this.state.saveKeysToDelete
      })
    });
  }
  updateClosePopup()
  {
    // TODO refactor
    if (isFinite(this.popupID))
    {
      // this.popupManager.setPopupContent(this.popupID,
      //   {contentText: this.getClosePopupContent().content});
    }
    else if (this.state.saveKeysToDelete.length < 1)
    {
      if (isFinite(this.popupID)) this.popupManager.closePopup(this.popupID);
      this.popupID = undefined;
    }
  }
  handleClose(deleteSaves: boolean = true, afterCloseCallback?: Function)
  {
    if (!deleteSaves || this.state.saveKeysToDelete.length < 1)
    {
      this.props.handleClose();
      if (afterCloseCallback) afterCloseCallback();
      return;
    }

    this.popupID = this.popupManager.makePopup(
    {
      content: ConfirmPopup(this.getClosePopupContent(afterCloseCallback, true, true)),
      popupProps:
      {
        dragPositionerProps:
        {
          preventAutoResize: true
        }
      }
    });
  }
  handleDelete(saveKey: string)
  {
    this.setState(
    {
      saveKeysToDelete: this.state.saveKeysToDelete.concat(saveKey)
    }, this.updateClosePopup);
  }
  handleUndoDelete(saveKey: string, callback?: () => void)
  {
    var afterDeleteFN = () =>
    {
      this.updateClosePopup();
      if (callback)
      {
        callback();
      }
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
  }
  overRideLightBoxClose()
  {
    this.handleClose();
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
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true
        }),
        SaveList(
        {
          onRowChange: this.handleRowChange,
          autoSelect: !Boolean(app.game.gameStorageKey),
          selectedKey: app.game.gameStorageKey,
          allowDelete: true,
          onDelete: this.handleDelete,
          onUndoDelete: this.handleUndoDelete,
          saveKeysToDelete: this.state.saveKeysToDelete,
          onDoubleClick: this.handleLoad
        }),
        React.DOM.form(
        {
          className: "save-game-form",
          onSubmit: this.handleLoad,
          action: "javascript:void(0);"
        },
          React.DOM.input(
          {
            className: "save-game-name",
            type: "text",
            value: this.state.saveKey ? this.state.saveKey.replace("Rance.Save.", "") : "",
            readOnly: true
          })
        ),
        React.DOM.div(
        {
          className: "save-game-buttons-container"
        },
          React.DOM.button(
          {
            className: "save-game-button",
            onClick: this.handleLoad,
            ref: (component: HTMLElement) =>
            {
              this.ref_TODO_okButton = component;
            }
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(LoadGameComponent);
export default Factory;
