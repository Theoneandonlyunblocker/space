/// <reference path="lightbox.ts"/>

/// <reference path="../items/buyitems.ts"/>

/// <reference path="../saves/savegame.ts"/>
/// <reference path="../saves/loadgame.ts"/>
/// <reference path="../unitlist/itemequip.ts"/>
/// <reference path="economysummary.ts"/>
/// <reference path="optionslist.ts"/>
/// <reference path="diplomacyoverview.ts"/>

module Rance
{
  export module UIComponents
  {
    export var TopMenu = React.createClass(
    {
      displayName: "TopMenu",
      getInitialState: function()
      {
        return(
        {
          opened: null,
          lightBoxElement: null
        });
      },

      handleEquipItems: function()
      {
        if (this.state.opened === "equipItems")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "equipItems",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.ItemEquip(
              {
                player: this.props.player
              })
            })
          });
        }
      },

      handleBuyItems: function()
      {
        if (this.state.opened === "buyItems")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "buyItems",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.BuyItems(
              {
                player: this.props.player
              })
            })
          });
        }
      },

      handleEconomySummary: function()
      {
        if (this.state.opened === "economySummary")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "economySummary",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.EconomySummary(
              {
                player: this.props.player
              })
            })
          });
        }
      },

      handleSaveGame: function()
      {
        if (this.state.opened === "saveGame")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "saveGame",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.SaveGame(
              {
                handleClose: this.closeLightBox
              })
            })
          });
        }
      },

      handleLoadGame: function()
      {
        if (this.state.opened === "loadGame")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "loadGame",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.LoadGame(
              {
                handleClose: this.closeLightBox
              })
            })
          });
        }
      },

      handleOptions: function()
      {
        if (this.state.opened === "options")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "options",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.OptionsList(
              {
                handleClose: this.closeLightBox
              })
            })
          });
        }
      },

      handleDiplomacy: function()
      {
        if (this.state.opened === "diplomacy")
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            opened: "diplomacy",
            lightBoxElement: UIComponents.LightBox(
            {
              handleClose: this.closeLightBox,
              content: UIComponents.DiplomacyOverview(
              {
                handleClose: this.closeLightBox,
                totalPlayerCount: this.props.game.playerOrder.length,
                metPlayers: this.props.player.diplomacyStatus.metPlayers,
                statusByPlayer: this.props.player.diplomacyStatus.statusByPlayer
              })
            })
          });
        }
      },

      closeLightBox: function()
      {
        if (this.state.opened === "options")
        {
          saveOptions();
        }
        
        this.setState(
        {
          opened: null,
          lightBoxElement: null
        });
      },


      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "top-menu"
          },
            React.DOM.div(
            {
              className: "top-menu-items"
            },
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleSaveGame
              }, "Save"),
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleLoadGame
              }, "Load"),
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleOptions
              }, "Options"),
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleDiplomacy
              }, "Diplomacy"),
              /*
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleEconomySummary
              }, "Economy"),
*/
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleBuyItems
              }, "Buy items"),
              React.DOM.button(
              {
                className: "top-menu-items-button",
                onClick: this.handleEquipItems
              }, "Equip")
            ),
            this.state.lightBoxElement
          )
        );
      }
    })
  }
}
