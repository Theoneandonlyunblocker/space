/// <reference path="../lib/pixi.d.ts" />
/// <reference path="spritesheetcachingfunctions" />

module Rance
{
  export class AppLoader
  {
    loaded =
    {
      DOM: false,
    };
    startTime: number;
    onLoaded: any;

    constructor(onLoaded: any)
    {
      this.onLoaded = onLoaded;
      PIXI.utils._saidHello = true;
      this.startTime = new Date().getTime();

      this.loadDOM();
    }
    loadDOM()
    {
      var self = this;
      if (document.readyState === "interactive" || document.readyState === "complete")
      {
        self.loaded.DOM = true;
        self.checkLoaded();
      }
      else
      {
        document.addEventListener('DOMContentLoaded', function()
        {
          self.loaded.DOM = true;
          self.checkLoaded();
        });
      }
    }
    checkLoaded()
    {
      for (var prop in this.loaded)
      {
        if (!this.loaded[prop])
        {
          return;
        }
      }
      var elapsed = new Date().getTime() - this.startTime;
      console.log("Loaded in " + elapsed + " ms");
      this.onLoaded.call();
    }
  }
}