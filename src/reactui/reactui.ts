/// <reference path="../../lib/react.d.ts" />

/// <reference path="../eventmanager.ts"/>
/// <reference path="stage.ts"/>

module Rance
{
  export class ReactUI
  {
    currentScene: string;
    stage: any;
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
      this.stage = React.renderComponent(
        UIComponents.Stage(
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
}