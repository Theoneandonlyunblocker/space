/// <reference path="../lib/react-0.13.3.d.ts" />

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
  public currentScene: string;
  public battle: Battle;
  public battlePrep: BattlePrep;
  public renderer: Renderer;
  public mapRenderer: MapRenderer;
  public playerControl: PlayerControl;
  public player: Player;
  public game: Game;

  constructor(public container: HTMLElement)
  {
    React.initializeTouchEvents(true);
    this.addEventListeners();
  }
  private addEventListeners()
  {
    eventManager.addEventListener("switchScene", this.switchScene.bind(this));
    eventManager.addEventListener("renderUI", this.render.bind(this));
  }
  public switchScene(newScene: string)
  {
    this.currentScene = newScene;
    this.render();
  }
  public destroy()
  {
    eventManager.removeAllListeners("switchScene");
    eventManager.removeAllListeners("renderUI");
    React.unmountComponentAtNode(this.container);
    this.container = null;
  }
  public render()
  {
    React.render(
      Stage(
      {
        sceneToRender: this.currentScene,
        battle: this.battle,
        battlePrep: this.battlePrep,
        renderer: this.renderer,
        mapRenderer: this.mapRenderer,
        playerControl: this.playerControl,
        player: this.player,
        game: this.game
      }),
      this.container
    );
  }
}
