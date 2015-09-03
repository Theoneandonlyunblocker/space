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

              getSceneBounds: this.getSceneBounds
            }),
            UIComponents.BattleSceneUnit(
            {
              unit: this.props.unit2,
              side: "side2",

              getSceneBounds: this.getSceneBounds
            })
          )
        );
      }
    })
  }
}
