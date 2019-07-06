import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnitEffectTemplate} from "../../../../src/templateinterfaces/UnitEffectTemplate";


export interface PropTypes extends React.Props<any>
{
  passiveEffects?: UnitEffectTemplate[];
}

interface StateType
{
}

export class UnitPassiveEffectsComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "UnitPassiveEffects";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      (this.props.passiveEffects && this.props.passiveEffects.length > 0) ?
        ReactDOMElements.img(
        {
          className: "unit-passive-effects-icon",
          src: "img/icons/availableAction.png",
          title: this.props.passiveEffects.reduce((t, e) =>
          {
            return `${t}${e.displayName}: ${e.description}\n`;
          }, ""),
        }) :
        null
    );
  }
}

export const UnitPassiveEffects: React.Factory<PropTypes> = React.createFactory(UnitPassiveEffectsComponent);
