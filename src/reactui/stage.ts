/// <reference path="../../lib/react.d.ts" />

/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="unitlist/itemequip.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="galaxymap/galaxymap.ts"/>
/// <reference path="setupgame/setupgame.ts"/>

/// <reference path="flagmaker.ts"/>

module Rance
{
  export module UIComponents
  {
    export interface ReactComponentPlaceHolder
    {

    }
    export interface ReactDOMPlaceHolder
    {
      
    }
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
        var elementsToRender: ReactComponentPlaceHolder[] = [];

        switch (this.props.sceneToRender)
        {
          case "battle":
          {
            elementsToRender.push(
              UIComponents.Battle(
              {
                battle: this.props.battle,
                humanPlayer: this.props.player,
                renderer: this.props.renderer,
                key: "battle"
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
                renderer: this.props.renderer,
                key: "battlePrep"
              })
            );
            break;
          }
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
            ),
            !Options.debugMode ? null : React.DOM.button(
            {
              className: "debug",
              onClick: function(e:any)
              {
                // https://github.com/facebook/react/issues/2988
                // https://github.com/facebook/react/issues/2605#issuecomment-118398797
                // without this react will keep a reference to this element causing a big memory leak
                e.target.blur();
                window.setTimeout(function()
                {
                  var position = extendObject(app.renderer.camera.container.position);
                  var zoom = app.renderer.camera.currZoom;
                  app.destroy();

                  app.initUI();

                  app.game = app.makeGame();
                  app.initGame();

                  app.initDisplay();
                  app.hookUI();
                  app.reactUI.switchScene("galaxyMap");
                  app.renderer.camera.zoom(zoom);
                  app.renderer.camera.container.position = position;
                }, 0);
              }
            },
              "Reset app"
            )
          )
        );
      }
    });
  }
}