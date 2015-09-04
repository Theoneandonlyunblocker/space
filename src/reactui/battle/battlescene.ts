/// <reference path="battlesceneunit.ts" />

module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",
      mixins: [React.addons.PureRenderMixin],

      componentDidUpdate: function(oldProps: any)
      {
        if (this.props.effectSFX && this.props.effectSFX.battleOverlay)
        {
          if ( !oldProps.effectSFX ||
            this.props.effectSFX.battleOverlay !== oldProps.effectSFX.battleOverlay)
          {
            this.drawBattleOverlay();
          }
        }
      },

      getSceneBounds: function()
      {
        return this.refs.scene.getDOMNode().getBoundingClientRect();
      },

      drawBattleOverlay: function()
      {
        var container = this.refs.overlay.getDOMNode();
        if (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }

        var bounds = this.getSceneBounds();
        var battleOverlay = this.props.effectSFX.battleOverlay(
        {
          user: this.props.unit1IsActive ? this.props.unit1 : this.props.unit2,
          width: bounds.width,
          height: bounds.height,
          duration: this.props.effectDuration,
          facingRight: this.props.unit1IsActive ? true : false
        });

        container.appendChild(battleOverlay);
      },

      render: function()
      {
        var unit1SpriteFN, unit1OverlayFN, unit2SpriteFN, unit2OverlayFN;
        if (this.props.effectSFX)
        {
          if (this.props.unit1IsActive)
          {
            unit1SpriteFN = this.props.effectSFX.userSprite;
            unit1OverlayFN = this.props.effectSFX.userOverlay;

            unit2OverlayFN = this.props.effectSFX.enemyOverlay;
          }
          else
          {
            unit2SpriteFN = this.props.effectSFX.userSprite;
            unit2OverlayFN = this.props.effectSFX.userOverlay;

            unit1OverlayFN = this.props.effectSFX.enemyOverlay;
          }
        }


        return(
          React.DOM.div(
          {
            className: "battle-scene",
            ref: "scene"
          },
            UIComponents.BattleSceneUnit(
            {
              unit: this.props.unit1,
              side: "side1",

              effectDuration: this.props.effectDuration,
              effectSpriteFN: unit1SpriteFN,
              effectOverlayFN: unit1OverlayFN,

              getSceneBounds: this.getSceneBounds
            }),
            UIComponents.BattleSceneUnit(
            {
              unit: this.props.unit2,
              side: "side2",

              effectDuration: this.props.effectDuration,
              effectSpriteFN: unit2SpriteFN,
              effectOverlayFN: unit2OverlayFN,

              getSceneBounds: this.getSceneBounds
            }),
            React.DOM.div(
            {
              className: "battle-scene-overlay-container",
              ref: "overlay"
            },
              null // battle overlay SFX drawn on canvas
            )
          )
        );
      }
    })
  }
}
