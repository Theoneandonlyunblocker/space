/// <reference path="../../../lib/react.d.ts" />

module Rance
{
  export module UIComponents
  {
    export var FocusTimer =
    {
      componentDidMount: function()
      {
        this.setFocusTimer();
      },
      registerFocusTimerListener: function()
      {
        window.addEventListener("focus", this.setFocusTimer, false);
      },
      clearFocusTimerListener: function()
      {
        window.removeEventListener("focus", this.setFocusTimer);
      },
      setFocusTimer: function()
      {
        this.lastFocusTime = Date.now();
      }
    }
  }
}