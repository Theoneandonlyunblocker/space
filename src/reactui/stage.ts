/// <reference path="../../lib/react.d.ts" />

/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="mapgen/mapgen.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Stage = React.createClass(
    {
      render: function()
      {
        var elementsToRender = [];

        switch (this.props.sceneToRender)
        {
          case "battle":
          {
            elementsToRender.push(
              UIComponents.Battle(
              {
                battle: this.props.battle,
                key: "battle"
              })
            );
            break;
          }
          case "mapGen":
          {
            elementsToRender.push(
              UIComponents.MapGen(
              {
                renderer: this.props.renderer,
                mapGen: this.props.mapGen,
                key: "mapGen"
              })
            );
            break;
          }
          case "battlePrep":
          {
            elementsToRender.push(
              UIComponents.BattlePrep(
              {
                battlePrep: this.props.battlePrep,
                key: "battlePrep"
              })
            );
            break;
          }
        }
        return(
          React.DOM.div({className: "react-stage"},
            elementsToRender
          )
        );
      }
    });
  }
}