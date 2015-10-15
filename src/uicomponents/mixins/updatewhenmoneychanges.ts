/// <reference path="../../../lib/react.d.ts" />

module Rance
{
  export module UIComponents
  {
    export var UpdateWhenMoneyChanges =
    {
      handleMoneyChange: function()
      {
        if (this.overrideHandleMoneyChange)
        {
          this.overrideHandleMoneyChange();
        }
        else
        {
          this.setState(
          {
            money: this.props.player.money
          });
        }
      },

      componentDidMount: function()
      {
        eventManager.addEventListener("playerMoneyUpdated", this.handleMoneyChange);
      },

      componentWillUnmount: function()
      {
        eventManager.removeEventListener("playerMoneyUpdated", this.handleMoneyChange);
      },
    }
  }
}