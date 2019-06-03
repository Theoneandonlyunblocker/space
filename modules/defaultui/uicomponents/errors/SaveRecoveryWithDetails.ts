import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import { ErrorDetails } from "./ErrorDetails";
import { SaveRecovery } from "./SaveRecovery";
import Game from "../../../../src/Game";

// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  game: Game | undefined;
  error: Error;
  customMessage?: string;
}

interface StateType
{
}

export class SaveRecoveryWithDetailsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SaveRecoveryWithDetails";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "error-plus-save-recovery",
      },
      ErrorDetails(
        {
          error: this.props.error,
          customMessage: this.props.customMessage,
        }),
        this.props.game ? SaveRecovery() : null,
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const SaveRecoveryWithDetails: React.Factory<PropTypes> = React.createFactory(SaveRecoveryWithDetailsComponent);
