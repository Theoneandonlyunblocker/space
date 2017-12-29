import * as React from "react";
import * as ReactDOM from "react-dom";

import BattleFinish from "./BattleFinish";
import BattleSceneFlag from "./BattleSceneFlag";

import BattleScene from "../../BattleScene";
import {Flag} from "../../Flag";


export interface PropTypes extends React.Props<any>
{
  battleState: "start" | "active" | "finish";
  battleScene: BattleScene;
  humanPlayerWonBattle: boolean;

  flag1: Flag;
  flag2: Flag;
}

interface StateType
{
}

export class BattleSceneComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleScene";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  shouldComponentUpdate(newProps: PropTypes)
  {
    const propsThatShouldTriggerUpdate =
    {
      battleState: true,
    };

    for (let key in newProps)
    {
      if (propsThatShouldTriggerUpdate[key] && newProps[key] !== this.props[key])
      {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (this.props.battleState === "start" && newProps.battleState === "active")
    {
      this.props.battleScene.bindRendererView(ReactDOM.findDOMNode<HTMLElement>(this));
      this.props.battleScene.resume();
    }
    else if (this.props.battleState === "active" && newProps.battleState === "finish")
    {
      this.props.battleScene.destroy();
    }
  }

  render()
  {
    let componentToRender: React.ReactElement<any> | null;

    switch (this.props.battleState)
    {
      case "start":
      {
        componentToRender = React.DOM.div(
        {
          className: "battle-scene-flags-container",
        },
          BattleSceneFlag(
          {
            flag: this.props.flag1,
            facingRight: true,
          }),
          BattleSceneFlag(
          {
            flag: this.props.flag2,
            facingRight: false,
          }),
        );
        break;
      }
      case "active":
      {
        componentToRender = null; // has battlescene view
        break;
      }
      case "finish":
      {
        componentToRender = BattleFinish(
        {
          humanPlayerWonBattle: this.props.humanPlayerWonBattle,
        });
        break;
      }
    }

    return(
      React.DOM.div(
      {
        className: "battle-scene",
      },
        componentToRender,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleSceneComponent);
export default Factory;
