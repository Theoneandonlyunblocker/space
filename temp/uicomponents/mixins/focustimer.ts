/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

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
