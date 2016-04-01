/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../player.ts" />
/// <reference path="../../unit.ts" />

/// <reference path="battlesceneflag.ts" />

var bs: any;

export interface PropTypes
{
  battleState: string; // "start", "active", "finish"

  targetUnit?: Unit;
  userUnit?: Unit;
  activeUnit?: Unit;
  hoveredUnit?: Unit;
  activeSFX?: reactTypeTODO_object; // Templates.IBattleSFXTemplate

  afterAbilityFinishedCallback?: reactTypeTODO_func;
  triggerEffectCallback?: reactTypeTODO_func;
  humanPlayerWonBattle?: boolean;
  side1Player?: Player;
  side2Player?: Player;
}

export default class BattleScene extends React.Component<PropTypes, {}>
{
  displayName: string = "BattleScene";

  battleScene: null, // Rance.BattleScene


  shouldComponentUpdate(newProps: any)
  {
    var shouldTriggerUpdate =
    {
      battleState: true
    };

    for (var key in newProps)
    {
      if (shouldTriggerUpdate[key] && newProps[key] !== this.props[key])
      {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(newProps: any)
  {
    bs = this;
    var self = this;

    if (this.props.battleState === "start" && newProps.battleState === "active")
    {
      this.battleScene = new Rance.BattleScene(this.getDOMNode());
      this.battleScene.resume();
    }
    else if (this.props.battleState === "active" && newProps.battleState === "finish")
    {
      this.battleScene.destroy();
      this.battleScene = null;
    }

    var battleScene: Rance.BattleScene = this.battleScene;

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

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var componentToRender: ReactDOMPlaceHolder;

    switch (this.props.battleState)
    {
      case "start":
      {
        componentToRender = React.DOM.div(
        {
          className: "battle-scene-flags-container"
        },
          UIComponents.BattleSceneFlag(
          {
            flag: this.props.side1Player.flag,
            facingRight: true
          }),
          UIComponents.BattleSceneFlag(
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
        componentToRender = React.DOM.div(
        {
          className: "battle-scene-finish-container"
        },
          React.DOM.h1(
          {
            className: "battle-scene-finish-header"
          },
            this.props.humanPlayerWonBattle ? "You win" : "You lose"
          ),
          React.DOM.h3(
          {
            className: "battle-scene-finish-subheader"
          },
            "Click to continue"
          )
        )
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
