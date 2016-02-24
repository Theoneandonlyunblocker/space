/// <reference path="../../player.ts" />
/// <reference path="../../unit.ts" />

/// <reference path="battlesceneflag.ts" />

var bs2: any = null;

module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",

      battleScene: null, // Rance.BattleScene

      propTypes:
      {
        battleState: React.PropTypes.string.isRequired, // "start", "active", "finish"

        targetUnit: React.PropTypes.instanceOf(Unit),
        userUnit: React.PropTypes.instanceOf(Unit),
        activeUnit: React.PropTypes.instanceOf(Unit),
        hoveredUnit: React.PropTypes.instanceOf(Unit),

        activeSFX: React.PropTypes.object, // Templates.IBattleSFXTemplate
        humanPlayerWonBattle: React.PropTypes.bool,

        side1Player: React.PropTypes.instanceOf(Player),
        side2Player: React.PropTypes.instanceOf(Player)
      },

      shouldComponentUpdate: function(newProps: any)
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
      },

      componentWillReceiveProps: function(newProps: any)
      {
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

        if (newProps.activeSFX !== this.props.activeSFX)
        {
          this.battleScene.setActiveSFX(newProps.activeSFX, newProps.userUnit, newProps.targetUnit);
        }
        else
        {
          [
            "targetUnit",
            "userUnit",
            "activeUnit",
            "hoveredUnit"
          ].forEach(function(unitKey: string)
          {
            self.battleScene.setUnit(unitKey, newProps[unitKey]);
          });
        }
      },
      
      componentDidMount: function()
      {
        bs2 = this;
      },

      render: function()
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
    })
  }
}
