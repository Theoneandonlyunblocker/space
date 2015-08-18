/// <reference path="../../lib/react.d.ts" />

/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="unitlist/itemequip.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="galaxymap/galaxymap.ts"/>
/// <reference path="setupgame/setupgame.ts"/>

/// <reference path="flagmaker.ts"/>
/// <reference path="battlescenetester.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Stage = React.createClass(
    {
      displayName: "Stage",
      changeScene: function()
      {
        var newScene = this.refs.sceneSelector.getDOMNode().value;

        this.props.changeSceneFunction(newScene);
      },

      render: function()
      {
        var elementsToRender = [];

        switch (this.props.sceneToRender)
        {
          case "galaxyMap":
          {
            elementsToRender.push(
              UIComponents.GalaxyMap(
              {
                renderer: this.props.renderer,
                mapRenderer: this.props.mapRenderer,
                playerControl: this.props.playerControl,
                player: this.props.player,
                game: this.props.game,
                key: "galaxyMap"
              })
            );
            break;
          }
          case "flagMaker":
          {
            elementsToRender.push(
              UIComponents.FlagMaker(
              {
                key: "flagMaker"
              })
            );
            break;
          }
          case "battleScene":
          {
            elementsToRender.push(
              UIComponents.BattleSceneTester(
              {
                key: "battleScene"
              })
            );
            break;
          }
          case "setupGame":
          {
            elementsToRender.push(
              UIComponents.SetupGame(
              {
                key: "setupGame"
              })
            );
            break;
          }
        }
        return(
          React.DOM.div({className: "react-stage"},
            elementsToRender,
            !Options.debugMode ? null : React.DOM.select(
              {
                className: "reactui-selector debug",
                ref: "sceneSelector",
                value: this.props.sceneToRender,
                onChange: this.changeScene
              },
              React.DOM.option({value: "galaxyMap"}, "map"),
              React.DOM.option({value: "flagMaker"}, "make flags"),
              React.DOM.option({value: "battleScene"}, "battle scene"),
              React.DOM.option({value: "setupGame"}, "setup game")
            )
          )
        );
      }
    });
  }
}