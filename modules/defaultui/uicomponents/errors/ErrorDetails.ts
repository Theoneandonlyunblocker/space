import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  errorMessage: string;
  customMessage?: string;
}

interface StateType
{
}

export class ErrorDetailsComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "ErrorDetails";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  {
    return(
      ReactDOMElements.div(
      {
        className: "error-details",
      },
        ReactDOMElements.h1(
        {
          className: "error-header"
        },
          localize("genericError")(),
        ),
        ReactDOMElements.h2(
        {
          className: "error-description",
        },
          localize("genericErrorDescription")(),
        ),
        ReactDOMElements.h3(
        {
          className: "error-cause-description",
        },
          localize("genericErrorCauseDescription")(),
        ),
        !this.props.customMessage ? null :
          ReactDOMElements.h3(
          {
            className: "error-custom-message"
          },
            this.props.customMessage,
          ),
        ReactDOMElements.p(
        {
          className: "error-instructions",
        },
          `${localize("checkConsolePrompt")()} (${localize("openConsoleInstructions")()})`,
        )
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const ErrorDetails: React.Factory<PropTypes> = React.createFactory(ErrorDetailsComponent);
