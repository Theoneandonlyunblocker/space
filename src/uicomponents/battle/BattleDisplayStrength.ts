import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactMotion from "react-motion";
import { fixedDurationSpring } from "../../utility";


export interface PropTypes extends React.Props<any>
{
  animationDuration: number;
  from: number;
  to: number;
}

interface StateType
{
}

export class BattleDisplayStrengthComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleDisplayStrength";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      React.createElement(ReactMotion.Motion,
      {
        style: {health: fixedDurationSpring(this.props.to, this.props.animationDuration)},
        defaultStyle: {health: this.props.from},
      },
        (interpolatedStyle: {health: number}) =>
        {
          return ReactDOMElements.div({className: "unit-strength-battle-display"},
            Math.ceil(interpolatedStyle.health),
          );
        }
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattleDisplayStrengthComponent);
export default factory;
