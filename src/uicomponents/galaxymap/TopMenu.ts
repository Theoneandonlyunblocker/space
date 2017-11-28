import * as React from "react";
import * as ReactDOM from "react-dom";

import Game from "../../Game";
import NotificationLog from "../../NotificationLog";
import Options from "../../Options";
import Player from "../../Player";
import eventManager from "../../eventManager";

import {Language} from "../../localization/Language";

import {default as TopMenuPopups, PopupType, TopMenuPopupsComponent} from "./TopMenuPopups";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
  activeLanguage: Language;
  notificationLog: NotificationLog;
}

interface StateType
{
  condensedMenuOpened: boolean;
  hasCondensedMenu: boolean;
  opened: boolean;
  buttonsToPlace: number;
}

export class TopMenuComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName: string = "TopMenu";
  public state: StateType;

  private cachedTopMenuWidth: number = undefined;
  private cachedButtonWidths: number[] = [];
  private cachedMenuButtonWidth: number = 37;

  private ref_TODO_topMenu: HTMLElement;
  private ref_TODO_popups: TopMenuPopupsComponent;
  private ref_TODO_topMenuItems: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public componentDidMount()
  {
    window.addEventListener("resize", this.handleResize, false);
    eventManager.addEventListener("playerControlUpdated", this.delayedResize);
    eventManager.addEventListener("updateHamburgerMenu", this.handleToggleHamburger);

    this.handleResize();
  }
  public componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
    eventManager.removeEventListener("playerControlUpdated", this.delayedResize);
    eventManager.removeEventListener("updateHamburgerMenu", this.handleToggleHamburger);
  }
  public render()
  {
    const menuItemTabIndex = this.state.opened ? -1 : 0;
    const menuItemTitle = "Left click to open. Right click to close";

    const topMenuButtons =
    [
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-production",
        key: "production",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "production"),
        onDoubleClick: this.closePopup.bind(this, "production"),
        onContextMenu: this.closePopup.bind(this, "production"),
        tabIndex: menuItemTabIndex,
      }, localize("production")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-equip",
        key: "equipItems",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "equipItems"),
        onDoubleClick: this.closePopup.bind(this, "equipItems"),
        onContextMenu: this.closePopup.bind(this, "equipItems"),
        tabIndex: menuItemTabIndex,
      }, localize("equip")),
      // React.DOM.button(
      // {
      //   className: "top-menu-items-button top-menu-items-button-economy",
      //   key: "economySummary",
      //   title: menuItemTitle,
      //   onClick: this.openOrBringPopupToTop.bind(this, "economySummary"),
      //   onDoubleClick: this.closePopup.bind(this, "economySummary"),
      //   onContextMenu: this.closePopup.bind(this, "economySummary"),
      //   tabIndex: menuItemTabIndex,
      // }, localize("economy")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-diplomacy",
        key: "diplomacy",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "diplomacy"),
        onDoubleClick: this.closePopup.bind(this, "diplomacy"),
        onContextMenu: this.closePopup.bind(this, "diplomacy"),
        tabIndex: menuItemTabIndex,
      }, localize("diplomacy")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-technology",
        key: "technologies",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "technologies"),
        onDoubleClick: this.closePopup.bind(this, "technologies"),
        onContextMenu: this.closePopup.bind(this, "technologies"),
        tabIndex: menuItemTabIndex,
      }, localize("technology")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-load",
        key: "loadGame",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "loadGame"),
        onDoubleClick: this.closePopup.bind(this, "loadGame"),
        onContextMenu: this.closePopup.bind(this, "loadGame"),
        tabIndex: menuItemTabIndex,
      }, localize("load_action")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-save",
        key: "saveGame",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "saveGame"),
        onDoubleClick: this.closePopup.bind(this, "saveGame"),
        onContextMenu: this.closePopup.bind(this, "saveGame"),
        tabIndex: menuItemTabIndex,
      }, localize("save_action")),
      React.DOM.button(
      {
        className: "top-menu-items-button top-menu-items-button-options",
        key: "options",
        title: menuItemTitle,
        onClick: this.openOrBringPopupToTop.bind(this, "options"),
        onDoubleClick: this.closePopup.bind(this, "options"),
        onContextMenu: this.closePopup.bind(this, "options"),
        tabIndex: menuItemTabIndex,
      }, localize("options")),
    ];

    const topMenuItems = topMenuButtons.slice(0, this.state.buttonsToPlace);
    const leftoverButtons = topMenuButtons.slice(this.state.buttonsToPlace);

    if (this.state.hasCondensedMenu && !Options.ui.noHamburger)
    {
      topMenuItems.push(React.DOM.button(
      {
        className: "top-menu-items-button top-menu-open-condensed-button",
        key: "openCondensedMenu",
        title: menuItemTitle,
        onClick: this.toggleCondensedMenu,
        onContextMenu: e =>
        {
          e.preventDefault();
          e.stopPropagation();

          if (this.state.condensedMenuOpened)
          {
            this.toggleCondensedMenu();
          }
        },
        tabIndex: menuItemTabIndex,
      }));
    }

    let openedCondensedMenu: React.ReactHTMLElement<any> = null;
    if ((this.state.condensedMenuOpened || Options.ui.noHamburger) && leftoverButtons.length > 0)
    {
      openedCondensedMenu = React.DOM.div(
      {
        className: "top-menu-opened-condensed-menu",
      },
        leftoverButtons,
      );
    };

    return(
      React.DOM.div(
      {
        className: "top-menu-wrapper",
      },
        React.DOM.div(
        {
          className: "top-menu",
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_topMenu = component;
          },
        },
          React.DOM.div(
          {
            className: "top-menu-items",
            ref: (component: HTMLElement) =>
            {
              this.ref_TODO_topMenuItems = component;
            },
          },
            topMenuItems,
          ),
        ),
        openedCondensedMenu,
        TopMenuPopups(
        {
          ref: (component: TopMenuPopupsComponent) =>
          {
            this.ref_TODO_popups = component;
          },
          player: this.props.player,
          game: this.props.game,
          activeLanguage: this.props.activeLanguage,
          notificationLog: this.props.notificationLog,
        }),
      )
    );
  }

  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
    this.openOrBringPopupToTop = this.openOrBringPopupToTop.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.toggleCondensedMenu = this.toggleCondensedMenu.bind(this);
    this.handleToggleHamburger = this.handleToggleHamburger.bind(this);
    this.delayedResize = this.delayedResize.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      hasCondensedMenu: false,
      opened: false,
      buttonsToPlace: 999,
      condensedMenuOpened: Options.ui.noHamburger,
    });
  }
  private handleToggleHamburger()
  {
    this.handleResize();
    this.forceUpdate();
  }
  private delayedResize()
  {
    window.setTimeout(this.handleResize, 0);
  }
  private handleResize()
  {
    if (!this.cachedTopMenuWidth)
    {
      this.cachedTopMenuWidth = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_topMenu).getBoundingClientRect().width;

      const buttons = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_topMenuItems).children;

      const margin = parseInt(window.getComputedStyle(buttons[0]).margin) * 2;

      for (let i = 0; i < buttons.length; i++)
      {
        const buttonWidth = buttons[i].getBoundingClientRect().width + margin;
        this.cachedButtonWidths.push(buttonWidth);
      }
    }

    const topMenuHeight = window.innerHeight > 600 ? 50 : 32;

    const topBar = <HTMLElement> document.getElementsByClassName("top-bar-info")[0];
    const topBarRect = topBar.getBoundingClientRect();

    let rightmostElement = topBar;
    let rightmostRect = topBarRect;

    const fleetContainer = <HTMLElement> document.getElementsByClassName("fleet-selection")[0];
    if (fleetContainer)
    {
      let fleetElementToCheckAgainst: HTMLElement;
      const firstChild: HTMLElement = <HTMLElement> fleetContainer.firstChild;

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
        const fleetRect = fleetElementToCheckAgainst.getBoundingClientRect();

        if (fleetRect.top < topMenuHeight && fleetRect.right > topBarRect.right)
        {
          rightmostElement = fleetElementToCheckAgainst;
          rightmostRect = fleetRect;
        }
      }
    }

    let spaceAvailable = window.innerWidth - rightmostRect.right;
    const hasCondensedMenu = spaceAvailable < this.cachedTopMenuWidth;
    let amountOfButtonsToPlace = 0;

    if (hasCondensedMenu)
    {
      if (!Options.ui.noHamburger)
      {
        spaceAvailable -= this.cachedMenuButtonWidth;
      }
      const padding = window.innerHeight > 600 ? 25 : 0;

      for (let i = 0; i < this.cachedButtonWidths.length; i++)
      {
        const buttonWidthToCheck = this.cachedButtonWidths[i];
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
      buttonsToPlace: amountOfButtonsToPlace,
    });
  }
  private openOrBringPopupToTop(popupType: PopupType): void
  {
    if (this.ref_TODO_popups.state[popupType])
    {
      this.ref_TODO_popups.bringPopupToFront(popupType);
    }
    else
    {
      this.ref_TODO_popups.togglePopup(popupType);
    }
  }
  private closePopup(popupType: PopupType, e: React.MouseEvent<HTMLButtonElement>): void
  {
    e.preventDefault();
    e.stopPropagation();

    if (this.ref_TODO_popups.state[popupType])
    {
      this.ref_TODO_popups.togglePopup(popupType)
    }
  }
  private toggleCondensedMenu()
  {
    this.setState(
    {
      condensedMenuOpened: !this.state.condensedMenuOpened,
    });
  }


}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuComponent);
export default Factory;
