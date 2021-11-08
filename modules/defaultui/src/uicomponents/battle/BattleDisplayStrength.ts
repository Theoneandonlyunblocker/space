import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactMotion from "react-motion";
import { fixedDurationSpring } from "core/src/generic/utility";


export interface PropTypes extends React.Props<any>
{
  animationDuration: number | null;
  from: number;
  to: number;
}

interface StateType
{
}

export class BattleDisplayStrengthComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "BattleDisplayStrength";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      React.createElement(ReactMotion.Motion,
      {
        style:
        {
          health: this.props.animationDuration ?
            fixedDurationSpring(this.props.to, this.props.animationDuration) :
            this.props.to,
        },
        defaultStyle: {health: this.props.from},
      },
        (interpolatedStyle: {health: number}) =>
        {
          return ReactDOMElements.div({className: "unit-strength-battle-display"},
            Math.round(interpolatedStyle.health),
          );
        }
      )
    );
  }
}

export const BattleDisplayStrength: React.Factory<PropTypes> = React.createFactory(BattleDisplayStrengthComponent);
