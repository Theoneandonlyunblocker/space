import * as React from "react";
import { ErrorReportingMode } from "core/app/ErrorReportingMode";
import {ErrorBoundary} from "./ErrorBoundary";
import {SaveRecoveryWithDetails} from "./SaveRecoveryWithDetails";
import {Game} from "core/game/Game";
import {localize} from "../../localization/localize";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  errorMessage: string;
  errorReportingMode: ErrorReportingMode;
  game: Game;
}

interface StateType
{
}

export class TopLevelErrorBoundaryComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "TopLevelErrorBoundary";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render(): React.ReactNode
  {
    return(
      ErrorBoundary(
      {
        renderError: (errorMessage) =>
        {
          // TODO 2018.10.30 | doesn't respect user error handling preference.
          // react doesn't let us ignore errors in rendering I think

          const customErrorMessage = this.props.errorReportingMode !== "panic" ?
            localize("UIErrorPanicDespiteUserPreference").format(this.props.errorReportingMode) :
            null;

          return SaveRecoveryWithDetails(
          {
            game: this.props.game,
            errorMessage: errorMessage,
            customMessage: customErrorMessage,
          });
        },
      },
        this.props.children,
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const TopLevelErrorBoundary: React.Factory<PropTypes> = React.createFactory(TopLevelErrorBoundaryComponent);
