/// <reference path="../../lib/react.d.ts" />

/// <reference path="stage.ts"/>

module Rance
{
  export class ReactUI
  {
    currentScene: string;
    battle: Battle;
    battlePrep: BattlePrep;
    
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
      React.renderComponent(
        UIComponents.Stage(
          {
            sceneToRender: this.currentScene,
            battle: this.battle,
            battlePrep: this.battlePrep
          }
        ),
        this.container
      );
    }
  }
}