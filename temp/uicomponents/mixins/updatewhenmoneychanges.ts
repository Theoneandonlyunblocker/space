/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

namespace Rance
{
  export namespace UIComponents
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