import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import { EmergencySaveGame } from "../saves/EmergencySaveGame";
import { ErrorBoundary, ErrorBoundaryComponent } from "./ErrorBoundary";
import { default as LoadGame } from "../saves/LoadGame";
import { default as SaveGame } from "../saves/SaveGame";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{

}

interface StateType
{
  expandedElementType: "save" | "load" | null;

}

export class SaveRecoveryComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SaveRecovery";
  public state: StateType;

  private readonly saveRecoveryErrorBoundary: React.RefObject<ErrorBoundaryComponent> = React.createRef<ErrorBoundaryComponent>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      expandedElementType: null,
    };

    this.handleExpandButtonClick = this.handleExpandButtonClick.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "save-recovery"
      },
        ReactDOMElements.p(
        {
          className: "save-recovery-possible-message",
        },
          localize("canTryToRecoverGame")(),
        ),
        ReactDOMElements.div(
        {
          className: "save-recovery-buttons"
        },
          ReactDOMElements.button(
          {
            className: "save-recovery-button",
            onClick: () => this.handleExpandButtonClick("save"),
          },
            localize("save_action")(),
          ),
          ReactDOMElements.button(
          {
            className: "save-recovery-button",
            onClick: () => this.handleExpandButtonClick("load"),
          },
            localize("load_action")(),
          ),
        ),
        ErrorBoundary(
        {
          ref: this.saveRecoveryErrorBoundary,
          renderError: () =>
          {
            return(
              ReactDOMElements.div(
              {
                className: "error-in-save-recovery",
              },
                ReactDOMElements.h3(
                {
                  className: "error-in-save-recovery-title",
                },
                  localize("errorWithGameRecovery")(),
                ),
                EmergencySaveGame(),
              )
            );
          },
        },
          this.state.expandedElementType ? this.renderExpandedElement() : null,
        ),
      )
    );
  }

  private renderExpandedElement(): React.ReactNode | null
  {
    switch (this.state.expandedElementType)
    {
      case "save":
        return SaveGame({handleClose: this.handleExpandButtonClick.bind(this, "save")});
      case "load":
        return LoadGame({handleClose: this.handleExpandButtonClick.bind(this, "load")});
      case null:
        return null;
    }
  }
  private handleExpandButtonClick(buttonType: "save" | "load"): void
  {
    this.saveRecoveryErrorBoundary.current.clearError();

    if (this.state.expandedElementType === buttonType)
    {
      this.setState({expandedElementType: null});
    }
    else
    {
      this.setState({expandedElementType: buttonType});
    }
  }
}

// tslint:disable-next-line:variable-name
export const SaveRecovery: React.Factory<PropTypes> = React.createFactory(SaveRecoveryComponent);
