/// <reference path="../../../lib/react-global.d.ts" />

import BattleFinish from "./BattleFinish";
import BattleSceneFlag from "./BattleSceneFlag";

import Flag from "../../Flag";
import BattleScene from "../../BattleScene";

import Unit from "../../Unit";
import BattleSFXTemplate from "../../templateinterfaces/BattleSFXTemplate";
import Player from "../../Player";


interface PropTypes extends React.Props<any>
{
  battleState: "start" | "active" | "finish";
  battleScene: BattleScene;
  humanPlayerWonBattle: boolean;
  flag1: Flag;
  flag2: Flag;
  
  targetUnit?: Unit;
  userUnit?: Unit;
  activeUnit?: Unit;
  hoveredUnit?: Unit;
  activeSFX?: BattleSFXTemplate;

  afterAbilityFinishedCallback?: () => void;
  triggerEffectCallback?: (forceUpdate?: boolean) => void;
  side1Player?: Player;
  side2Player?: Player;
}

interface StateType
{
}

export class BattleSceneComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleScene";

  battleScene: BattleScene;


  shouldComponentUpdate(newProps: PropTypes)
  {
    var shouldTriggerUpdate =
    {
      battleState: true
    };

    for (let key in newProps)
    {
      if (shouldTriggerUpdate[key] && newProps[key] !== this.props[key])
      {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    var self = this;

    if (this.props.battleState === "start" && newProps.battleState === "active")
    {
      this.battleScene = new BattleScene(ReactDOM.findDOMNode<HTMLElement>(this));
      this.battleScene.resume();
    }
    else if (this.props.battleState === "active" && newProps.battleState === "finish")
    {
      this.battleScene.destroy();
      this.battleScene = null;
    }

    var battleScene: BattleScene = this.battleScene;

    if (battleScene)
    {
      var activeSFXChanged = newProps.activeSFX !== this.props.activeSFX;
      var shouldPlaySFX = Boolean(newProps.activeSFX &&
      (
        activeSFXChanged ||
        newProps.targetUnit !== this.props.targetUnit ||
        newProps.userUnit !== this.props.userUnit
      ));


      if (shouldPlaySFX)
      {
        battleScene.handleAbilityUse(
        {
          user: newProps.userUnit,
          target: newProps.targetUnit,
          SFXTemplate: newProps.activeSFX,
          afterFinishedCallback: newProps.afterAbilityFinishedCallback,
          triggerEffectCallback: newProps.triggerEffectCallback
        });
      }
      else if (activeSFXChanged)
      {
        battleScene.clearActiveSFX();
      }

      var unitsHaveUpdated = false;
      [
        "targetUnit",
        "userUnit",
        "activeUnit",
        "hoveredUnit"
      ].forEach(function(unitKey: string)
      {
        if (battleScene[unitKey] !== newProps[unitKey])
        {
          unitsHaveUpdated = true;
        }
        battleScene[unitKey] = newProps[unitKey];
      });

      if (unitsHaveUpdated && !shouldPlaySFX && !newProps.activeSFX)
      {
        battleScene.updateUnits();
      }
    }
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var componentToRender: React.ReactElement<any>;

    switch (this.props.battleState)
    {
      case "start":
      {
        componentToRender = React.DOM.div(
        {
          className: "battle-scene-flags-container"
        },
          BattleSceneFlag(
          {
            flag: this.props.side1Player.flag,
            facingRight: true
          }),
          BattleSceneFlag(
          {
            flag: this.props.side2Player.flag,
            facingRight: false
          })
        )
        break;
      }
      case "active":
      {
        componentToRender = null;
        break;
      }
      case "finish":
      {
        componentToRender = BattleFinish(
        {
          humanPlayerWonBattle: this.props.humanPlayerWonBattle
        })
        break;
      }
    }

    return(
      React.DOM.div(
      {
        className: "battle-scene"
      },
        componentToRender
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleSceneComponent);
export default Factory;
