/// <reference path="../../../lib/react-global.d.ts" />

import Player from "../../Player";
import Game from "../../Game";
import Options from "../../Options";
import {default as TopMenuPopups, TopMenuPopupsComponent} from "./TopMenuPopups";
import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
}

interface StateType
{
  condensedMenuOpened?: boolean;
  hasCondensedMenu?: boolean;
  opened?: boolean;
  buttonsToPlace?: number;
}

export class TopMenuComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenu";
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
  state: StateType;

  cachedTopMenuWidth: number = undefined;
  cachedButtonWidths: number[] = [];
  cachedMenuButtonWidth: number = 37;

  ref_TODO_topMenu: HTMLElement;
  ref_TODO_popups: TopMenuPopupsComponent;
  ref_TODO_topMenuItems: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleCondensedMenu = this.toggleCondensedMenu.bind(this);
    this.handleToggleHamburger = this.handleToggleHamburger.bind(this);
    this.delayedResize = this.delayedResize.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      hasCondensedMenu: false,
      buttonsToPlace: 999,
      condensedMenuOpened: Options.ui.noHamburger
    });
  }

  componentDidMount()
  {
    window.addEventListener("resize", this.handleResize, false);
    eventManager.addEventListener("playerControlUpdated", this.delayedResize);
    eventManager.addEventListener("updateHamburgerMenu", this.handleToggleHamburger);

    this.handleResize();
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
    eventManager.removeEventListener("playerControlUpdated", this.delayedResize);
    eventManager.removeEventListener("updateHamburgerMenu", this.handleToggleHamburger);
  }

  handleToggleHamburger()
  {
    this.handleResize();
    this.forceUpdate();
  }

  delayedResize()
  {
    window.setTimeout(this.handleResize, 0);
  }

  handleResize()
  {
    if (!this.cachedTopMenuWidth)
    {
      this.cachedTopMenuWidth = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_topMenu).getBoundingClientRect().width;

      var buttons = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_topMenuItems).children;

      var margin = parseInt(window.getComputedStyle(buttons[0]).margin) * 2;

      for (let i = 0; i < buttons.length; i++)
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

      for (let i = 0; i < this.cachedButtonWidths.length; i++)
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
  }

  togglePopup(popupType: string)
  {
    this.ref_TODO_popups.togglePopup(popupType);
    this.forceUpdate();
  }

  toggleCondensedMenu()
  {
    this.setState(
    {
      condensedMenuOpened: !this.state.condensedMenuOpened
    });
  }

  render()
  {
    var menuItemTabIndex = this.state.opened ? -1 : 0;

    var topMenuButtons =
    [
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-production",
        key: "production",
        onClick: this.togglePopup.bind(this, "production"),
        tabIndex: menuItemTabIndex
      }, "Production"),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-equip",
        key: "equipItems",
        onClick: this.togglePopup.bind(this, "equipItems"),
        tabIndex: menuItemTabIndex
      }, "Equip"),
      /*
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-economy",
        key: "economySummary",
        onClick: this.togglePopup.bind(this, "economySummary"),
        tabIndex: menuItemTabIndex
      }, "Economy"),
      */
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-diplomacy",
        key: "diplomacy",
        onClick: this.togglePopup.bind(this, "diplomacy"),
        tabIndex: menuItemTabIndex
      }, "Diplomacy"),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-technology",
        key: "technologies",
        onClick: this.togglePopup.bind(this, "technologies"),
        tabIndex: menuItemTabIndex
      }, "Technology"),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-load",
        key: "loadGame",
        onClick: this.togglePopup.bind(this, "loadGame"),
        tabIndex: menuItemTabIndex
      }, "Load"),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-save",
        key: "saveGame",
        onClick: this.togglePopup.bind(this, "saveGame"),
        tabIndex: menuItemTabIndex
      }, "Save"),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-options",
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

    var openedCondensedMenu: React.ReactHTMLElement<any> = null;
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
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_topMenu = component;
          }
        },
          React.DOM.div(
          {
            className: "top-menu-items",
            ref: (component: HTMLElement) =>
            {
              this.ref_TODO_topMenuItems = component;
            }
          },
            topMenuItems
          )
        ),
        openedCondensedMenu,
        TopMenuPopups(
        {
          ref: (component: TopMenuPopupsComponent) =>
          {
            this.ref_TODO_popups = component;
          },
          player: this.props.player,
          game: this.props.game
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuComponent);
export default Factory;
