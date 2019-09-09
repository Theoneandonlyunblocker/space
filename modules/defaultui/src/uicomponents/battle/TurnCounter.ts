import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  isEmpty: boolean;
  animationDuration: number;
}

interface StateType
{
  isExiting: boolean;
}

export class TurnCounterComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "TurnCounter";
  public state: StateType;

  private inner: HTMLDivElement | null;
  private animationTimeoutHandle: number;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isExiting: false,
    };

    this.finishFadeOutAnimation = this.finishFadeOutAnimation.bind(this);
  }

  public componentDidMount(): void
  {
    if (this.inner)
    {
      this.inner.style.animationDuration = "" + this.props.animationDuration + "ms";
    }
  }
  public componentDidUpdate(prevProps: PropTypes): void
  {
    if (!prevProps.isEmpty && this.props.isEmpty)
    {
      this.setState(
      {
        isExiting: true,
      }, () =>
      {
        window.setTimeout(this.finishFadeOutAnimation, this.props.animationDuration);
      });
    }
  }
  public componentWillUnmount(): void
  {
    if (this.animationTimeoutHandle)
    {
      window.clearTimeout(this.animationTimeoutHandle);
    }
  }
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "turn-counter" +
          (!this.props.isEmpty ? " turn-counter-available-border" : ""),
      },
        this.props.isEmpty && !this.state.isExiting ? null : ReactDOMElements.div(
        {
          key: "inner",
          className: "available-turn" + (this.state.isExiting ? " available-turn-leave-active" : ""),
          ref: element =>
          {
            this.inner = element;
          },
        }),
      )
    );
  }
  private finishFadeOutAnimation(): void
  {
    window.clearTimeout(this.animationTimeoutHandle);
    this.setState(
    {
      isExiting: false,
    });
  }
}

export const TurnCounter: React.Factory<PropTypes> = React.createFactory(TurnCounterComponent);
