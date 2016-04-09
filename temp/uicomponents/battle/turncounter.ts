/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

export default class TurnCounter extends React.Component<PropTypes, {}>
{
  displayName: string = "TurnCounter";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];
  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var turnsLeft = this.props.turnsLeft;

    var turns: ReactDOMPlaceHolder[] = [];

    var usedTurns = this.props.maxTurns - turnsLeft;

    for (var i = 0; i < usedTurns; i++)
    {
      turns.push(
        React.DOM.div(
        {
          key: "used" + i,
          className: "turn-counter used-turn"
        })
      );
    }

    for (var i = 0; i < turnsLeft; i++)
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
