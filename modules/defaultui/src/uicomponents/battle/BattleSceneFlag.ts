import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Flag} from "core/src/flag/Flag";

import {PlayerFlag} from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  facingRight: boolean;
}

interface StateType
{
}

export class BattleSceneFlagComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "BattleSceneFlag";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {

    return(
      ReactDOMElements.div(
      {
        className: "battle-scene-flag-container" + (this.props.facingRight ? " facing-right" : " facing-left"),
      },
        PlayerFlag(
        {
          props:
          {
            className: "battle-scene-flag",
          },
          flag: this.props.flag,
        }),
      )
    );
  }
}

export const BattleSceneFlag: React.Factory<PropTypes> = React.createFactory(BattleSceneFlagComponent);
