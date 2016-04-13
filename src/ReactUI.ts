/// <reference path="../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Battle from "./Battle";
import BattlePrep from "./BattlePrep";
import Renderer from "./Renderer";
import MapRenderer from "./MapRenderer";
import PlayerControl from "./PlayerControl";
import Player from "./Player";
import Game from "./Game";
import eventManager from "./eventManager";

import Stage from "./uicomponents/Stage";

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

  constructor(public container: HTMLElement)
  {
    React.initializeTouchEvents(true);
    this.addEventListeners();
  }
  addEventListeners()
  {
    eventManager.addEventListener("switchScene", this.switchScene.bind(this));
    eventManager.addEventListener("renderUI", this.render.bind(this));
  }
  switchScene(newScene: string)
  {
    this.currentScene = newScene;
    this.render();
  }
  destroy()
  {
    eventManager.removeAllListeners("switchScene");
    eventManager.removeAllListeners("renderUI");
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
