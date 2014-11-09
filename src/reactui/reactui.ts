/// <reference path="../../lib/react.d.ts" />

/// <reference path="stage.ts"/>

module Rance
{
  export class ReactUI
  {
    currentScene: string;
    constructor(public container: HTMLElement, public battle, public battlePrep)
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