import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import { storageStrings } from "../../storageStrings";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{

}

interface StateType
{
  saveName: string;
  actionStatusMessage: string | null;
  saveData: string | null;
  saveDataStatusMessage: string;
}

export class EmergencySaveGameComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "EmergencySaveGame";
  public state: StateType;

  private saveNameElement = React.createRef<HTMLInputElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      saveName: "",
      actionStatusMessage: null,
      saveData: null,
      saveDataStatusMessage: null,
    };

    try
    {
      this.state.saveData = app.game.getSaveData(storageStrings.panicSave);
      this.state.saveDataStatusMessage = localize("saveDataCopyPrompt")();
    }
    catch (e)
    {
      this.state.saveDataStatusMessage = localize("activeGameUnserializable")();
    }

    this.handleSave = this.handleSave.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "emergency-save-game",
      },
        ReactDOMElements.div(
        {
          className: "emergency-save-game-action"
        },
          ReactDOMElements.form(
          {
            className: "emergency-save-game-form",
            onSubmit: this.handleSave,
            action: "javascript:void(0);",
          },
            ReactDOMElements.input(
            {
              className: "emergency-save-game-name",
              ref: this.saveNameElement,
              type: "text",
              value: this.state.saveName,
              onChange: (e) => {this.setState({saveName: e.currentTarget.value});},
              maxLength: 64,
            }),
            ReactDOMElements.input(
            {
              className: "emergency-save-game-button",
              type: "submit",
              value: localize("save_action")(),
            }),
          ),
          !this.state.actionStatusMessage ? null :
            ReactDOMElements.div(
            {
              className: "emergency-save-game-action-message",
            },
              this.state.actionStatusMessage,
            ),
        ),
        ReactDOMElements.div(
        {
          className: "emergency-save-game-data",
        },
          ReactDOMElements.div(
          {
            className: "emergency-save-game-data-status",
          },
            this.state.saveDataStatusMessage
          ),
          ReactDOMElements.label(
          {
            className: "import-data-label",
            htmlFor: "emergency-save-game-textarea",
          },
            localize("saveData")(),
          ),
          ReactDOMElements.textarea(
          {
            className: "import-data-textarea",
            id: "emergency-save-game-textarea",
            value: this.state.saveData,
            readOnly: true,
          }),
        )
      )
    );
  }

  private handleSave(): void
  {
    try
    {
      app.game.save(this.state.saveName);
      this.setState(
      {
        actionStatusMessage: localize("saveSuccessful")(),
      });
    }
    catch (e)
    {
      this.setState(
      {
        actionStatusMessage: localize("saveFailure")(),
      });
    }
  }
}

// tslint:disable-next-line:variable-name
export const EmergencySaveGame: React.Factory<PropTypes> = React.createFactory(EmergencySaveGameComponent);
