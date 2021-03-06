import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {app} from "core/src/app/App"; // TODO global
import { storageStrings } from "core/src/saves/storageStrings";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
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
  public override state: StateType;

  private readonly saveNameElement = React.createRef<HTMLInputElement>();

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
      this.state.saveDataStatusMessage = localize("saveDataCopyPrompt").toString();
    }
    catch (e)
    {
      this.state.saveDataStatusMessage = localize("activeGameUnserializable").toString();
    }

    this.handleSave = this.handleSave.bind(this);
  }

  public override render()
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
            onSubmit: e =>
            {
              e.preventDefault();
              this.handleSave();
            },
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
              value: localize("save_action").toString(),
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
            localize("saveData").toString(),
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
        actionStatusMessage: localize("saveSuccessful").toString(),
      });
    }
    catch (e)
    {
      this.setState(
      {
        actionStatusMessage: localize("saveFailure").toString(),
      });
    }
  }
}

// tslint:disable-next-line:variable-name
export const EmergencySaveGame: React.Factory<PropTypes> = React.createFactory(EmergencySaveGameComponent);
