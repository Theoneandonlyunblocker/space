import * as React from "react";
import * as ReactTransitionGroup from "react-transition-group";


// tslint:disable-next-line:variable-name
const ReactCSSTransitionGroup = React.createFactory(ReactTransitionGroup.CSSTransitionGroup);

// tslint:disable-next-line:variable-name
const FirstChild = React.createClass(
{
  render: function(this: any)
  {
    const child = <React.ReactElement<any>> React.Children.toArray(this.props.children)[0];
    return child || null;
  },
});

export interface PropTypes extends React.Props<any>
{
  isEmpty: boolean;
  animationDuration: number;
}

interface StateType
{
}

export class TurnCounterComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "TurnCounter";
  public state: StateType;
  inner: HTMLDivElement | null;

  constructor(props: PropTypes)
  {
    super(props);
  }

  componentDidMount()
  {
    if (this.inner)
    {
      this.inner.style.animationDuration = "" + this.props.animationDuration + "ms";
    }
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "turn-counter" +
          (!this.props.isEmpty ? " turn-counter-available-border" : ""),
      },
        ReactCSSTransitionGroup(
        {
          transitionName: "available-turn",
          transitionAppear: false,
          transitionEnter: false,
          transitionLeave: true,
          transitionLeaveTimeout: this.props.animationDuration,
          component: FirstChild,
        },
          this.props.isEmpty ? null : React.DOM.div(
          {
            key: "inner",
            className: "available-turn",
            ref: element =>
            {
              this.inner = element;
            },
          }),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(TurnCounterComponent);
export default factory;
