import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";

// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
{
  error: Error;
  errorInfo: React.ErrorInfo;
}

interface StateType
{
}

export class ErrorDetailsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ErrorDetails";
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
        className: "error-details",
      },
      ReactDOMElements.h1(
        {
          className: "ui-error-header"
        },
          localize("UIError")(),
        ),
        ReactDOMElements.h2(
        {
          className: "ui-error-description",
        },
          localize("UIErrorDescription")(),
        ),
        ReactDOMElements.h3(
        {
          className: "ui-error-cause-description",
        },
          localize("UIErrorCauseDescription")(),
        ),
        ReactDOMElements.p(
        {
          className: "ui-error-instructions",
        },
          `${localize("checkConsolePrompt")()} (${localize("openConsoleInstructions")()})`,
        )
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const ErrorDetails: React.Factory<PropTypes> = React.createFactory(ErrorDetailsComponent);
