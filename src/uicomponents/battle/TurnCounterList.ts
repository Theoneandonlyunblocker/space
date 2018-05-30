import * as React from "react";

import {localize} from "../../../localization/localize";

import {default as TurnCounter, PropTypes as TurnCounterProps} from "./TurnCounter";


export interface PropTypes extends React.Props<any>
{
  turnsLeft: number;
  maxTurns: number;
  animationDuration: number;
}

interface StateType
{
}

export class TurnCounterListComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "TurnCounterList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const turnElements: React.ReactElement<TurnCounterProps>[] = [];

    const usedTurns = this.props.maxTurns - this.props.turnsLeft;

    for (let i = 0; i < this.props.maxTurns; i++)
    {
      turnElements.push(
        TurnCounter(
        {
          key: i,
          isEmpty: i < usedTurns,
          animationDuration: this.props.animationDuration,
        }),
      );
    }

    return(
      React.DOM.div(
      {
        className: "turns-container",
        title: localize("turnsLeft_tooltip")(this.props.turnsLeft),
      },
        turnElements,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(TurnCounterListComponent);
export default factory;
