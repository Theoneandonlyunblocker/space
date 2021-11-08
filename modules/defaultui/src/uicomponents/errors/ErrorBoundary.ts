import * as React from "react";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  renderError: (errorMessage: string) => React.ReactNode;
}

interface StateType
{
  errorMessage: string | null;
}

export class ErrorBoundaryComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "ErrorBoundary";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      errorMessage: null,
    };
  }

  public clearError(): void
  {
    this.setState(
    {
      errorMessage: null,
    });
  }
  public override componentDidCatch(error: Error, info: React.ErrorInfo): void
  {
    this.setState(
    {
      errorMessage: error.message,
    });
  }
  public override render(): React.ReactNode
  {
    if (this.state.errorMessage)
    {
      return this.props.renderError(this.state.errorMessage);
    }
    else
    {
      return this.props.children;
    }
  }

}

// tslint:disable-next-line:variable-name
export const ErrorBoundary: React.Factory<PropTypes> = React.createFactory(ErrorBoundaryComponent);

