/// <reference path="lightbox.ts"/>

/// <reference path="../items/buyitems.ts"/>

/// <reference path="../saves/savegame.ts"/>
/// <reference path="../saves/loadgame.ts"/>
/// <reference path="../unitlist/itemequip.ts"/>
/// <reference path="../diplomacy/diplomacyoverview.ts"/>
/// <reference path="economysummary.ts"/>
/// <reference path="optionslist.ts"/>

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
                player: this.props.player,
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
        var menuItemTabIndex = this.state.opened ? -1 : 0;
        return(
          React.DOM.div(
          {
            className: "top-menu-wrapper"
          },
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
                  onClick: this.handleSaveGame,
                  tabIndex: menuItemTabIndex
                }, "Save"),
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleLoadGame,
                  tabIndex: menuItemTabIndex
                }, "Load"),
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleOptions,
                  tabIndex: menuItemTabIndex
                }, "Options"),
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleDiplomacy,
                  tabIndex: menuItemTabIndex
                }, "Diplomacy"),
                /*
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleEconomySummary,
                  tabIndex: menuItemTabIndex
                }, "Economy"),
                */
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleBuyItems,
                  tabIndex: menuItemTabIndex
                }, "Buy items"),
                React.DOM.button(
                {
                  className: "top-menu-items-button",
                  onClick: this.handleEquipItems,
                  tabIndex: menuItemTabIndex
                }, "Equip")
              )
            ),
            this.state.lightBoxElement
          )
        );
      }
    })
  }
}
