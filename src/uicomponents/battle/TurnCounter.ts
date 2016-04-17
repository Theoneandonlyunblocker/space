/// <reference path="../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  turnsLeft: number;
  maxTurns: number;
}

interface StateType
{
}

export class TurnCounterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TurnCounter";
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var turnsLeft = this.props.turnsLeft;

    var turns: React.ReactHTMLElement<any>[] = [];

    var usedTurns = this.props.maxTurns - turnsLeft;

    for (let i = 0; i < usedTurns; i++)
    {
      turns.push(
        React.DOM.div(
        {
          key: "used" + i,
          className: "turn-counter used-turn"
        })
      );
    }

    for (let i = 0; i < turnsLeft; i++)
    {
      turns.push(
        React.DOM.div(
        {
          key: "available" + i,
          className: "turn-counter available-turn"
        })
      );
    }

    return(
      React.DOM.div(
      {
        className: "turns-container",
        title: "Turns left: " + turnsLeft
      },
        turns
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnCounterComponent);
export default Factory;
