/// <reference path="../../../lib/react-global.d.ts" />

const ReactCSSTransitionGroup =
  React.createFactory(React.addons.CSSTransitionGroup);


const FirstChild = React.createClass(
{
  render: function(this: any)
  {
    const child = <React.ReactElement<any>> React.Children.toArray(this.props.children)[0];
    return child || null;
  }
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
  displayName: string = "TurnCounter";
  state: StateType;
  inner: HTMLDivElement;

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
          (!this.props.isEmpty ? " turn-counter-available-border" : "")
      },
        ReactCSSTransitionGroup(
        {
          transitionName: "available-turn",
          transitionAppear: false,
          transitionEnter: false,
          transitionLeave: true,
          transitionLeaveTimeout: this.props.animationDuration,
          component: FirstChild
        },
          this.props.isEmpty ? null : React.DOM.div(
          {
            key: "inner",
            className: "available-turn",
            ref: (element) =>
            {
              this.inner = element;
            }
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnCounterComponent);
export default Factory;
