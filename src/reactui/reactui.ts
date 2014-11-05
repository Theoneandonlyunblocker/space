/// <reference path="../../lib/react.d.ts" />

/// <reference path="stage.ts"/>

module Rance
{
  export class ReactUI
  {
    constructor(public container: HTMLElement, public battle)
    {
      this.render();
    }
    render()
    {
      React.renderComponent(
        UIComponents.Stage({battle: this.battle}),
        this.container
      );
    }
  }
}