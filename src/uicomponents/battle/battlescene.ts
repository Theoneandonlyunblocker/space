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

        targetUnit: React.PropTypes.instanceOf(Rance.Unit),
        userUnit: React.PropTypes.instanceOf(Rance.Unit),
        activeUnit: React.PropTypes.instanceOf(Rance.Unit),
        hoveredUnit: React.PropTypes.instanceOf(Rance.Unit),

        activeSFX: React.PropTypes.object, // Templates.IBattleSFXTemplate
        humanPlayerWonBattle: React.PropTypes.bool,

        side1Player: React.PropTypes.instanceOf(Rance.Player),
        side2Player: React.PropTypes.instanceOf(Rance.Player)
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

        if (this.battleScene)
        {
          var activeSFXChanged = newProps.activeSFX !== this.props.activeSFX;
          var shouldPlaySFX = newProps.activeSFX &&
          (
            activeSFXChanged ||
            newProps.targetUnit !== this.props.targetUnit ||
            newProps.userUnit !== this.props.userUnit
          );

          if (shouldPlaySFX)
          {
            this.battleScene.setActiveSFX(newProps.activeSFX, newProps.userUnit, newProps.targetUnit);
          }
          else if (activeSFXChanged)
          {
            this.battleScene.clearActiveSFX();
            this.battleScene.updateUnits();
          }
          else if (!newProps.activeSFX)
          {
            [
              "targetUnit",
              "userUnit",
              "activeUnit",
              "hoveredUnit"
            ].forEach(function(unitKey: string)
            {
              self.battleScene[unitKey] = newProps[unitKey];
            });
            
            this.battleScene.updateUnits();
          }
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
    })
  }
}
