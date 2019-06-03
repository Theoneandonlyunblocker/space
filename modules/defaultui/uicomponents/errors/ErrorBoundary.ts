import * as React from "react";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  handleError?: (error: Error, info: React.ErrorInfo) => void;
  renderError: (error: Error, info: React.ErrorInfo) => React.ReactNode;
}

interface StateType
{
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundaryComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "ErrorBoundary";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      error: null,
      errorInfo: null,
    };
  }

  public clearError(): void
  {
    this.setState(
    {
      error: null,
      errorInfo: null,
    });
  }
  public componentDidCatch(error: Error, info: React.ErrorInfo): void
  {
    this.setState(
    {
      error: error,
      errorInfo: info,
    });
  }
  public render(): React.ReactNode
  {
    if (this.state.error)
    {
      return this.props.renderError(this.state.error, this.state.errorInfo);
    }
    else
    {
      return this.props.children;
    }
  }

}

// tslint:disable-next-line:variable-name
export const ErrorBoundary: React.Factory<PropTypes> = React.createFactory(ErrorBoundaryComponent);

