/// <reference path="../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Battle from "./Battle.ts";
import BattlePrep from "./BattlePrep.ts";
import Renderer from "./Renderer.ts";
import MapRenderer from "./MapRenderer.ts";
import PlayerControl from "./PlayerControl.ts";
import Player from "./Player.ts";
import Game from "./Game.ts";
import eventManager from "./eventManager.ts";

import Stage from "./uicomponents/Stage.ts";

export default class ReactUI
{
  currentScene: string;
  stage: Stage;
  battle: Battle;
  battlePrep: BattlePrep;
  renderer: Renderer;
  mapRenderer: MapRenderer;
  playerControl: PlayerControl;
  player: Player;
  game: Game;

  switchSceneFN: any;

  constructor(public container: HTMLElement)
  {
    React.initializeTouchEvents(true);
    this.addEventListeners();
  }
  addEventListeners()
  {
    this.switchSceneFN = function(sceneName: string)
    {
      this.switchScene(sceneName);
    }.bind(this);

    eventManager.addEventListener("switchScene", this.switchSceneFN);
  }
  switchScene(newScene: string)
  {
    this.currentScene = newScene;
    this.render();
  }
  destroy()
  {
    eventManager.removeEventListener("switchScene", this.switchSceneFN);
    React.unmountComponentAtNode(this.container);
    this.stage = null;
    this.container = null;
  }
  render()
  {
    this.stage = React.render(
      Stage(
        {
          sceneToRender: this.currentScene,
          changeSceneFunction: this.switchScene.bind(this),
          battle: this.battle,
          battlePrep: this.battlePrep,
          renderer: this.renderer,
          mapRenderer: this.mapRenderer,
          playerControl: this.playerControl,
          player: this.player,
          game: this.game
        }
      ),
      this.container
    );
  }
}
