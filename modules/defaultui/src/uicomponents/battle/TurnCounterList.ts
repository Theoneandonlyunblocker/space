import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";

import {TurnCounter, PropTypes as TurnCounterProps} from "./TurnCounter";


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
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
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
      ReactDOMElements.div(
      {
        className: "turns-container",
        title: localize("turnsLeft_tooltip").format(this.props.turnsLeft),
      },
        turnElements,
      )
    );
  }
}

export const TurnCounterList: React.Factory<PropTypes> = React.createFactory(TurnCounterListComponent);
