/// <reference path="battlesceneunit.ts" />

module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",
      mixins: [React.addons.PureRenderMixin],

      getSceneBounds: function()
      {
        return this.refs.scene.getDOMNode().getBoundingClientRect();
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
            })
          )
        );
      }
    })
  }
}
