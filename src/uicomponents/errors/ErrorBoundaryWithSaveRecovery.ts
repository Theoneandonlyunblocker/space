import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import { ErrorBoundary } from "./ErrorBoundary";
import {localize} from "../../../localization/localize";
import { ErrorDetails } from "./ErrorDetails";
import Game from "../../Game";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  game: Game | undefined;
}

interface StateType
{
}

export class ErrorBoundaryWithSaveRecoveryComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ErrorBoundaryWithSaveRecovery";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.renderError = this.renderError.bind(this);
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
      ErrorBoundary(
      {
        renderError: () =>
        {
          return(
            ReactDOMElements.h1(
            {
              className: "error-in-error-with-saves",
            },
              localize("errorWithGameRecovery")(),
            )
          );
        },
      },
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

          ),
        ),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const ErrorBoundaryWithSaveRecovery: React.Factory<PropTypes> = React.createFactory(ErrorBoundaryWithSaveRecoveryComponent);
