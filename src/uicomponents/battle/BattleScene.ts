import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import BattleScene from "../../BattleScene";
import {Flag} from "../../Flag";

import BattleFinish from "./BattleFinish";
import BattleSceneFlag from "./BattleSceneFlag";


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

  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

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

    for (const key in newProps)
    {
      if (propsThatShouldTriggerUpdate[key] && newProps[key] !== this.props[key])
      {
        return true;
      }
    }

    return false;
  }

  componentDidUpdate(prevProps: PropTypes)
  {
    if (prevProps.battleState === "start" && this.props.battleState === "active")
    {
      this.props.battleScene.bindRendererView(this.ownDOMNode.current);
      this.props.battleScene.resume();
    }
    else if (prevProps.battleState === "active" && this.props.battleState === "finish")
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
        componentToRender = ReactDOMElements.div(
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
      ReactDOMElements.div(
      {
        className: "battle-scene",
        ref: this.ownDOMNode,
      },
        componentToRender,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattleSceneComponent);
export default factory;
