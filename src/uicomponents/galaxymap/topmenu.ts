/// <reference path="topmenupopups.ts" />

/// <reference path="../../player.ts" />
/// <reference path="../../game.ts" />

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

      propTypes:
      {
        player: React.PropTypes.instanceOf(Rance.Player).isRequired,
        game: React.PropTypes.instanceOf(Rance.Game).isRequired
      },

      getInitialState: function()
      {
        return(
        {
          hasCondensedMenu: false,
          buttonsToPlace: 999,
          condensedMenuOpened: Options.ui.noHamburger
        });
      },

      componentDidMount: function()
      {
        window.addEventListener("resize", this.handleResize, false);
        eventManager.addEventListener("playerControlUpdated", this.delayedResize);
        eventManager.addEventListener("updateHamburgerMenu", this.handleToggleHamburger);

        this.handleResize();
      },

      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
        eventManager.removeEventListener("playerControlUpdated", this.delayedResize);
        eventManager.removeEventListener("updateHamburgerMenu", this.handleToggleHamburger);
      },

      handleToggleHamburger: function()
      {
        this.handleResize();
        this.forceUpdate();
      },

      delayedResize: function()
      {
        window.setTimeout(this.handleResize, 0);
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

        var fleetContainer = <HTMLElement> document.getElementsByClassName("fleet-selection")[0];
        if (fleetContainer)
        {
          var fleetElementToCheckAgainst: HTMLElement;
          var firstChild: HTMLElement = <HTMLElement> fleetContainer.firstChild;

          if (firstChild.classList.contains("fleet-selection-controls"))
          {
            fleetElementToCheckAgainst = <HTMLElement> document.getElementsByClassName(
              "fleet-selection-selected-wrapper")[0];
          }
          else
          {
            fleetElementToCheckAgainst = firstChild;
          }

          if (fleetElementToCheckAgainst)
          {
            var fleetRect = fleetElementToCheckAgainst.getBoundingClientRect();

            if (fleetRect.top < topMenuHeight && fleetRect.right > topBarRect.right)
            {
              rightmostElement = fleetElementToCheckAgainst;
              rightmostRect = fleetRect;
            }
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

      togglePopup: function(popupType: string)
      {
        this.refs.popups.togglePopup(popupType);
        this.forceUpdate();
      },

      toggleCondensedMenu: function()
      {
        this.setState(
        {
          condensedMenuOpened: !this.state.condensedMenuOpened
        });
      },

      render: function()
      {
        var menuItemTabIndex = this.state.opened ? -1 : 0;

        var topMenuButtons =
        [
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "production",
            onClick: this.togglePopup.bind(this, "production"),
            tabIndex: menuItemTabIndex
          }, "Production"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "equipItems",
            onClick: this.togglePopup.bind(this, "equipItems"),
            tabIndex: menuItemTabIndex
          }, "Equip"),
          /*
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "economySummary",
            onClick: this.togglePopup.bind(this, "economySummary"),
            tabIndex: menuItemTabIndex
          }, "Economy"),
          */
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "diplomacy",
            onClick: this.togglePopup.bind(this, "diplomacy"),
            tabIndex: menuItemTabIndex
          }, "Diplomacy"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "technologies",
            onClick: this.togglePopup.bind(this, "technologies"),
            tabIndex: menuItemTabIndex
          }, "Technology"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "loadGame",
            onClick: this.togglePopup.bind(this, "loadGame"),
            tabIndex: menuItemTabIndex
          }, "Load"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "saveGame",
            onClick: this.togglePopup.bind(this, "saveGame"),
            tabIndex: menuItemTabIndex
          }, "Save"),
          React.DOM.button(
          {
            className: "top-menu-items-button",
            key: "options",
            onClick: this.togglePopup.bind(this, "options"),
            tabIndex: menuItemTabIndex
          }, "Options")
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
            UIComponents.TopMenuPopups(
            {
              ref: "popups",
              player: this.props.player,
              game: this.props.game
            })
          )
        );
      }
    })
  }
}
