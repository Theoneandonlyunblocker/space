import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import { ErrorBoundary, ErrorBoundaryComponent } from "./ErrorBoundary";
import {localize} from "../../../localization/localize";
import { ErrorDetails } from "./ErrorDetails";
import Game from "../../Game";
import { default as LoadGame } from "../saves/LoadGame";
import { default as SaveGame } from "../saves/SaveGame";
import { EmergencySaveGame } from "../saves/EmergencySaveGame";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  game: Game | undefined;
}

interface StateType
{
  expandedElementType: "save" | "load" | null;
}

export class ErrorBoundaryWithSaveRecoveryComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ErrorBoundaryWithSaveRecovery";
  public state: StateType;

  private saveRecoveryErrorBoundary = React.createRef<ErrorBoundaryComponent>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      expandedElementType: null,
    };

    this.renderError = this.renderError.bind(this);
    this.handleExpandButtonClick = this.handleExpandButtonClick.bind(this);
  }

  public render()
  {
    return(
      ErrorBoundary(
      {
        renderError: this.renderError.bind(false),
      },
        this.props.children
      )
    );
  }

  private renderError(error: Error, info: React.ErrorInfo): React.ReactNode
  {
    return(
      ReactDOMElements.div(
      {
        className: "error-with-saves",
      },
        ErrorDetails(
        {
          error: error,
          errorInfo: info,
        }),
        this.props.game ? this.renderSaveRecovery() : null,
      )
    );
  }
  private renderSaveRecovery(): React.ReactNode
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
export const ErrorBoundaryWithSaveRecovery: React.Factory<PropTypes> = React.createFactory(ErrorBoundaryWithSaveRecoveryComponent);
