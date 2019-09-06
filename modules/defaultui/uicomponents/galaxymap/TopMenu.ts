import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Game} from "core/game/Game";
import {options} from "core/app/Options";
import {Player} from "core/player/Player";
import {Star} from "core/map/Star";
import {eventManager} from "core/app/eventManager";
import {Language} from "core/localization/Language";

import {TopMenuPopups, PopupType, TopMenuPopupsComponent} from "./TopMenuPopups";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
  activeLanguage: Language;
  selectedStar: Star | null;
  setSelectedStar: (star: Star | null) => void;
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

  private readonly topMenuElement = React.createRef<HTMLDivElement>();
  private readonly popupsComponent = React.createRef<TopMenuPopupsComponent>();
  private readonly topMenuItemsElement = React.createRef<HTMLDivElement>();

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
    const buttonActionExplanation = localize("topMenuButtonActionExplanation").toString();

    const topMenuButtons =
    [
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-production",
        key: "production",
        title: `${localize("topMenuButtonTooltip_production")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "production"),
        onContextMenu: this.closePopup.bind(this, "production"),
        tabIndex: menuItemTabIndex,
      }, localize("production").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-equip",
        key: "equipItems",
        title: `${localize("topMenuButtonTooltip_equip")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "equipItems"),
        onContextMenu: this.closePopup.bind(this, "equipItems"),
        tabIndex: menuItemTabIndex,
      }, localize("equip").toString()),
      // ReactDOMElements.button(
      // {
      //   className: "top-menu-items-button top-menu-items-button-economy",
      //   key: "economySummary",
      //   title: `${localize("topMenuButtonTooltip_economy")}\n\n${buttonActionExplanation}`,
      //   onClick: this.toggleOrBringPopupToTop.bind(this, "economySummary"),
      //   onContextMenu: this.closePopup.bind(this, "economySummary"),
      //   tabIndex: menuItemTabIndex,
      // }, localize("economy").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-diplomacy",
        key: "diplomacy",
        title: `${localize("topMenuButtonTooltip_diplomacy")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "diplomacy"),
        onContextMenu: this.closePopup.bind(this, "diplomacy"),
        tabIndex: menuItemTabIndex,
      }, localize("diplomacy").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-technology",
        key: "technologies",
        title: `${localize("topMenuButtonTooltip_technology")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "technologies"),
        onContextMenu: this.closePopup.bind(this, "technologies"),
        tabIndex: menuItemTabIndex,
      }, localize("technology").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-load",
        key: "loadGame",
        title: `${localize("topMenuButtonTooltip_load")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "loadGame"),
        onContextMenu: this.closePopup.bind(this, "loadGame"),
        tabIndex: menuItemTabIndex,
      }, localize("load_action").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-save",
        key: "saveGame",
        title: `${localize("topMenuButtonTooltip_save")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "saveGame"),
        onContextMenu: this.closePopup.bind(this, "saveGame"),
        tabIndex: menuItemTabIndex,
      }, localize("save_action").toString()),
      ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-items-button-options",
        key: "options",
        title: `${localize("topMenuButtonTooltip_options")}\n\n${buttonActionExplanation}`,
        onClick: this.toggleOrBringPopupToTop.bind(this, "options"),
        onContextMenu: this.closePopup.bind(this, "options"),
        tabIndex: menuItemTabIndex,
      }, localize("options").toString()),
    ];

    const topMenuItems = topMenuButtons.slice(0, this.state.buttonsToPlace);
    const leftoverButtons = topMenuButtons.slice(this.state.buttonsToPlace);

    if (this.state.hasCondensedMenu && !options.display.noHamburger)
    {
      topMenuItems.push(ReactDOMElements.button(
      {
        className: "top-menu-items-button top-menu-open-condensed-button",
        key: "openCondensedMenu",
        title: localize("topMenuButtonTooltip_openCondensedMenu").toString(),
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
    if ((this.state.condensedMenuOpened || options.display.noHamburger) && leftoverButtons.length > 0)
    {
      openedCondensedMenu = ReactDOMElements.div(
      {
        className: "top-menu-opened-condensed-menu",
      },
        leftoverButtons,
      );
    }

    return(
      ReactDOMElements.div(
      {
        className: "top-menu-wrapper",
      },
        ReactDOMElements.div(
        {
          className: "top-menu",
          ref: this.topMenuElement,
        },
          ReactDOMElements.div(
          {
            className: "top-menu-items",
            ref: this.topMenuItemsElement,
          },
            topMenuItems,
          ),
        ),
        openedCondensedMenu,
        TopMenuPopups(
        {
          ref: this.popupsComponent,
          player: this.props.player,
          game: this.props.game,
          activeLanguage: this.props.activeLanguage,
          selectedStar: this.props.selectedStar,
          setSelectedStar: this.props.setSelectedStar,
        }),
      )
    );
  }

  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
    this.toggleOrBringPopupToTop = this.toggleOrBringPopupToTop.bind(this);
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
      condensedMenuOpened: options.display.noHamburger,
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
      this.cachedTopMenuWidth = this.topMenuItemsElement.current.getBoundingClientRect().width;

      const buttons = this.topMenuItemsElement.current.children;

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
          rightmostRect = fleetRect;
        }
      }
    }

    let spaceAvailable = window.innerWidth - rightmostRect.right;
    const hasCondensedMenu = spaceAvailable < this.cachedTopMenuWidth;
    let amountOfButtonsToPlace = 0;

    if (hasCondensedMenu)
    {
      if (!options.display.noHamburger)
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
  private toggleOrBringPopupToTop(popupType: PopupType): void
  {
    this.popupsComponent.current.toggleOrBringPopupToFront(popupType);
  }
  private closePopup(popupType: PopupType, e: React.MouseEvent<HTMLButtonElement>): void
  {
    e.preventDefault();
    e.stopPropagation();

    if (this.popupsComponent.current.state[popupType])
    {
      this.popupsComponent.current.togglePopup(popupType);
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

export const TopMenu: React.Factory<PropTypes> = React.createFactory(TopMenuComponent);
