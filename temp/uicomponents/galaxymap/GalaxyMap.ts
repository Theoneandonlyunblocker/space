/// <reference path="../../../lib/react-0.13.3.d.ts" />

import app from "../../../src/App.ts"; // TODO refactor | autogenerated
import * as React from "react";

/// <reference path="galaxymapui.ts"/>


import GalaxyMap from "../../../src/GalaxyMap.ts";
import GalaxyMapUI from "./GalaxyMapUI.ts";
import Options from "../../../src/options.ts";


export interface PropTypes extends React.Props<any>
{
  toCenterOn: any; // TODO refactor | define prop type 123
  player: any; // TODO refactor | define prop type 123
  playerControl: any; // TODO refactor | define prop type 123
  game: any; // TODO refactor | define prop type 123
  mapRenderer: any; // TODO refactor | define prop type 123
  renderer: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  pixiContainer: HTMLElement;
}

class GalaxyMap_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "GalaxyMap";
  
  changeScene(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    app.reactUI.switchScene(target.value);
  }

  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var mapModeOptions: React.HTMLElement[] = [];

    for (var mapModeName in this.props.mapRenderer.mapModes)
    {
      mapModeOptions.push(React.DOM.option(
      {
        value: mapModeName,
        key: mapModeName
      },
        this.props.mapRenderer.mapModes[mapModeName].template.displayName
      ));
    }

    return(
      React.DOM.div(
        {
          className: "galaxy-map"
        },
        React.DOM.div(
        {
          ref: "pixiContainer",
          id: "pixi-container"
        },
          GalaxyMapUI(
          {
            playerControl: this.props.playerControl,
            player: this.props.player,
            game: this.props.game,
            mapRenderer: this.props.mapRenderer,
            key: "galaxyMapUI"
          })
        ),
        !Options.debugMode ? null : React.DOM.div(
        {
          className: "galaxy-map-debug debug"
        },
          React.DOM.select(
            {
              className: "reactui-selector debug",
              ref: "sceneSelector",
              value: app.reactUI.currentScene,
              onChange: this.changeScene
            },
            React.DOM.option({value: "galaxyMap"}, "map"),
            React.DOM.option({value: "flagMaker"}, "make flags"),
            React.DOM.option({value: "setupGame"}, "setup game"),
            React.DOM.option({value: "battleSceneTester"}, "battle scene test")
          ),
          React.DOM.button(
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
              }, 5);
            }
          },
            "Reset app"
          )
        )
      )
    );
  }

  
  componentDidMount()
  {
    this.props.renderer.isBattleBackground = false;
    this.props.renderer.bindRendererView(React.findDOMNode(this.refs.pixiContainer));
    this.props.mapRenderer.setMapModeByKey("defaultMapMode");
    
    this.props.renderer.resume();

    // hack. transparency isn't properly rendered without this
    this.props.mapRenderer.setAllLayersAsDirty();

    var centerLocation = this.props.renderer.camera.toCenterOn ||
      this.props.toCenterOn ||
      this.props.player.controlledLocations[0];

    this.props.renderer.camera.centerOnPosition(centerLocation);
  }
  componentWillUnmount()
  {
    this.props.renderer.pause();
    this.props.renderer.removeRendererView();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(GalaxyMap_COMPONENT_TODO);
export default Factory;
