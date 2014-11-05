/// <reference path="../../lib/react.d.ts" />

/// <reference path="stage.ts"/>

module Rance
{
  export class ReactUI
  {
    constructor(public container: HTMLElement, public unit)
    {
      this.render();
    }
    render()
    {
      React.renderComponent(
        UIComponents.Stage({unit: this.unit}),
        this.container
      );
    }
  }
}