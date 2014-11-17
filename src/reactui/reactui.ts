/// <reference path="../../lib/react.d.ts" />

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
    mapGen: MapGen;
    galaxyMap: GalaxyMap;
    playerControl: PlayerControl;
    
    constructor(public container: HTMLElement)
    {

    }
    switchScene(newScene: string)
    {
      this.currentScene = newScene;
      this.render();
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
            mapGen: this.mapGen,
            galaxyMap: this.galaxyMap,
            playerControl: this.playerControl
          }
        ),
        this.container
      );
    }
  }
}