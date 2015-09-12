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
      mixins: [React.addons.PureRenderMixin],

      cachedTopMenuWidth: undefined,
      cachedButtonWidths: [],
      cachedMenuButtonWidth: 37,

      getInitialState: function()
      {
        return(
        {
          opened: null,
          lightBoxElement: null,
          hasCondensedMenu: false,
          buttonsToPlace: 999,
          condensedMenuOpened: Options.ui.noHamburger
        });
      },

      componentDidMount: function()
      {
        window.addEventListener("resize", this.handleResize, false);
        eventManager.addEventListener("playerControlUpdated", this.handleResize);
        eventManager.addEventListener("updateHamburgerMenu", this.handleToggleHamburger);

        this.handleResize();
      },

      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
        eventManager.removeEventListener("playerControlUpdated", this.handleResize);
        eventManager.removeEventListener("updateHamburgerMenu", this.handleToggleHamburger);
      },

      handleToggleHamburger: function()
      {
        this.handleResize();
        this.forceUpdate();
      },

      handleResize: function()
      {
        if (!this.cachedTopMenuWidth)
        {
          this.cachedTopMenuWidth = this.refs.topMenu.getDOMNode().getBoundingClientRect().width;

          var buttons = this.refs.topMenuItems.getDOMNode().children;

          var margin = parseInt(window.getComputedStyle(buttons[0]).margin) * 2;

          for (var i = 0; i < buttons.length; i++)
          {
            var buttonWidth = buttons[i].getBoundingClientRect().width + margin;
            this.cachedButtonWidths.push(buttonWidth);
          }
        }

        var topMenuHeight = window.innerHeight > 600 ? 50 : 32;

        var topBar = <HTMLElement> document.getElementsByClassName("top-bar-info")[0];
        var topBarRect = topBar.getBoundingClientRect();

        var rightmostElement = topBar;
        var rightmostRect = topBarRect;

        var fleetContainer = <HTMLElement> document.getElementsByClassName("fleet-selection-container")[0];
        if (fleetContainer)
        {
          var fleetElementToCheckAgainst: HTMLElement;
          if (fleetContainer.classList.contains("reorganizing"))
          {
            fleetElementToCheckAgainst = <HTMLElement> document.getElementsByClassName(
              "fleet-selection-selected-wrapper")[0];
          }
          else
          {
            fleetElementToCheckAgainst = fleetContainer;
          }

          var fleetRect = fleetElementToCheckAgainst.getBoundingClientRect();

          if (fleetRect.top < topMenuHeight && fleetRect.right > topBarRect.right)
          {
            rightmostElement = fleetElementToCheckAgainst;
            rightmostRect = fleetRect;
          }
        }

        var spaceAvailable = window.innerWidth - rightmostRect.right;
        var hasCondensedMenu = spaceAvailable < this.cachedTopMenuWidth;
        var amountOfButtonsToPlace = 0;

        if (hasCondensedMenu)
        {
          if (!Options.ui.noHamburger)
          {
            spaceAvailable -= this.cachedMenuButtonWidth;
          }
          var padding = window.innerHeight > 600 ? 25 : 0;

          for (var i = 0; i < this.cachedButtonWidths.length; i++)
          {
            var buttonWidthToCheck = this.cachedButtonWidths[i];
            if (spaceAvailable > buttonWidthToCheck + padding)
            {
              amountOfButtonsToPlace++;
              spaceAvailable -= buttonWidthToCheck;
            }
            else
            {
              break;
            }
          }
        }
        else
        {
          amountOfButtonsToPlace = this.cachedButtonWidths.length;
        }

        this.setState(
        {
          hasCondensedMenu: hasCondensedMenu,
          buttonsToPlace: amountOfButtonsToPlace
        });
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
              contentConstructor: UIComponents.ItemEquip,
              contentProps:
              {
                player: this.props.player
              }
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
              contentConstructor: UIComponents.BuyItems,
              contentProps:
              {
                player: this.props.player
              }
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
              contentConstructor: UIComponents.EconomySummary,
              contentProps:
              {
                player: this.props.player
              }
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
              contentConstructor: UIComponents.SaveGame,
              contentProps:
              {
                handleClose: this.closeLightBox
              }
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
              contentConstructor: UIComponents.LoadGame,
              contentProps:
              {
                handleClose: this.closeLightBox
              }
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
              contentConstructor: UIComponents.OptionsList,
              contentProps:
              {
                handleClose: this.closeLightBox
              }
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
              contentConstructor: UIComponents.DiplomacyOverview,
              contentProps:
              {
                handleClose: this.closeLightBox,
                player: this.props.player,
                totalPlayerCount: this.props.game.playerOrder.length,
                metPlayers: this.props.player.diplomacyStatus.metPlayers,
                statusByPlayer: this.props.player.diplomacyStatus.statusByPlayer
              }
            })
          });
        }
      },

      toggleCondensedMenu: function()
      {
        if (this.state.opened)
        {
          this.closeLightBox();
        }
        else
        {
          this.setState(
          {
            condensedMenuOpened: !this.state.condensedMenuOpened
          });
        }
      },

      render: function()
      {
        var menuItemTabIndex = this.state.opened ? -1 : 0;

        var topMenuButtons =
        [
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "equipItems",
            onClick: this.handleEquipItems,
            tabIndex: menuItemTabIndex
          }, "Equip"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "buyItems",
            onClick: this.handleBuyItems,
            tabIndex: menuItemTabIndex
          }, "Buy items"),
          /*
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "economySummary",
            onClick: this.handleEconomySummary,
            tabIndex: menuItemTabIndex
          }, "Economy"),
          */
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "diplomacy",
            onClick: this.handleDiplomacy,
            tabIndex: menuItemTabIndex
          }, "Diplomacy"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "options",
            onClick: this.handleOptions,
            tabIndex: menuItemTabIndex
          }, "Options"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "loadGame",
            onClick: this.handleLoadGame,
            tabIndex: menuItemTabIndex
          }, "Load"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "saveGame",
            onClick: this.handleSaveGame,
            tabIndex: menuItemTabIndex
          }, "Save")
        ]

        var topMenuItems = topMenuButtons.slice(0, this.state.buttonsToPlace);
        var leftoverButtons = topMenuButtons.slice(this.state.buttonsToPlace);

        if (this.state.hasCondensedMenu && !Options.ui.noHamburger)
        {
          topMenuItems.push(React.DOM.button(
          {
            className: "top-menu-items-button top-menu-open-condensed-button",
            key: "openCondensedMenu",
            onClick: this.toggleCondensedMenu,
            tabIndex: menuItemTabIndex
          }));
        }

        var openedCondensedMenu: ReactDOMPlaceHolder = null;
        if ((this.state.condensedMenuOpened || Options.ui.noHamburger) && leftoverButtons.length > 0)
        {
          openedCondensedMenu = React.DOM.div(
          {
            className: "top-menu-opened-condensed-menu"
          },
            leftoverButtons
          )
        };

        return(
          React.DOM.div(
          {
            className: "top-menu-wrapper"
          },
            React.DOM.div(
            {
              className: "top-menu",
              ref: "topMenu"
            },
              React.DOM.div(
              {
                className: "top-menu-items",
                ref: "topMenuItems"
              },
                topMenuItems
              )
            ),
            openedCondensedMenu,
            this.state.lightBoxElement
          )
        );
      }
    })
  }
}
