import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../../localization/localize";
import {Game} from "core/src/game/Game";
import {options} from "core/src/app/Options";
import {Player} from "core/src/player/Player";
import {Rect} from "core/src/math/Rect";
import {Star} from "core/src/map/Star";
import {Language} from "core/src/localization/Language";
import {DiplomacyOverview} from "../diplomacy/DiplomacyOverview";
import {ProductionOverview} from "../production/ProductionOverview";
import {LoadGame} from "../saves/LoadGame";
import {SaveGame} from "../saves/SaveGame";
import {TechnologiesList} from "../technologies/TechnologiesList";
import {ItemEquip} from "../unitlist/ItemEquip";
import {DefaultWindow, DefaultWindowComponent} from "../windows/DefaultWindow";

import {EconomySummary} from "./EconomySummary";
import {FullOptionsList} from "../options/FullOptionsList";
import { storageStrings } from "core/src/saves/storageStrings";


interface ValuesByPopup<T>
{
  production: T;
  equipItems: T;
  economySummary: T;
  saveGame: T;
  loadGame: T;
  options: T;
  diplomacy: T;
  technologies: T;
}

export type PopupType = keyof ValuesByPopup<{}>;

interface PopupConstructData
{
  makeContent: () => React.ReactElement<any>;
  title: string;
}

export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
  activeLanguage: Language;
  selectedStar: Star;
  setSelectedStar: (star: Star | null) => void;
}

type OpenedPopupsState = ValuesByPopup<boolean>;

type StateType = OpenedPopupsState;

export class TopMenuPopupsComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "TopMenuPopups";
  public state: StateType;

  private popupComponents: Partial<ValuesByPopup<React.RefObject<DefaultWindowComponent>>> = {};
  private cachedPopupPositions: Partial<ValuesByPopup<Rect>> = {};
  private popupConstructData: ValuesByPopup<PopupConstructData> =
  {
    production:
    {
      makeContent: () => ProductionOverview(
      {
        player: this.props.player,
        globalSelectedStar: this.props.selectedStar,
        setSelectedStar: this.props.setSelectedStar,
      }),
      get title()
      {
        return localize("production").toString();
      },
    },
    equipItems:
    {
      makeContent: () => ItemEquip(
      {
        player: this.props.player,
      }),
      get title()
      {
        return localize("equip").toString();
      },
    },
    economySummary:
    {
      makeContent: () => EconomySummary(
      {
        player: this.props.player,
      }),
      get title()
      {
        return localize("economy").toString();
      },
    },
    saveGame:
    {
      makeContent: () => SaveGame(
      {
        handleClose: this.closePopup.bind(this, "saveGame"),
      }),
      get title()
      {
        return localize("save_action").toString();
      },
    },
    loadGame:
    {
      makeContent: () => LoadGame(
      {
        handleClose: this.closePopup.bind(this, "loadGame"),
      }),
      get title()
      {
        return localize("load_action").toString();
      },
    },
    options:
    {
      makeContent: () => FullOptionsList(
      {
        activeLanguage: this.props.activeLanguage,
      }),
      get title()
      {
        return localize("options").toString();
      },
    },
    diplomacy:
    {
      makeContent: () => DiplomacyOverview(
      {
        player: this.props.player,
      }),
      get title()
      {
        return localize("diplomacy").toString();
      },
    },
    technologies:
    {
      makeContent: () => TechnologiesList(
      {
        playerTechnology: this.props.player.playerTechnology,
      }),
      get title()
      {
        return localize("technology").toString();
      },
    },
  };

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      production: false,
      equipItems: false,
      economySummary: false,
      saveGame: false,
      loadGame: false,
      options: false,
      diplomacy: false,
      technologies: false,
    };

    this.bindMethods();

    localForage.getItem<string>(storageStrings.windowPositions).then(storedWindowPositions =>
    {
      if (storedWindowPositions)
      {
        const parsed = JSON.parse(storedWindowPositions);
        for (const key in parsed)
        {
          this.cachedPopupPositions[key] = parsed[key];
        }
      }
    });
  }

  public togglePopup(popupType: PopupType)
  {
    if (this.state[popupType])
    {
      this.closePopup(popupType);
    }
    else
    {
      this.openPopup(popupType);
    }
  }
  public bringPopupToFront(popupType: PopupType): void
  {
    this.popupComponents[popupType].current.windowContainerComponent.current.bringToTop();
  }
  public toggleOrBringPopupToFront(popupType: PopupType): void
  {
    if (this.state[popupType])
    {
      const isTopMost = this.popupComponents[popupType].current.windowContainerComponent.current.isTopMostWindow();
      if (isTopMost)
      {
        this.closePopup(popupType);
      }
      else
      {
        this.bringPopupToFront(popupType);
      }
    }
    else
    {
      this.openPopup(popupType);
    }
  }
  public componentWillUnmount(): void
  {
    this.cacheAllWindowPositions();
    this.storeWindowPositions();
  }
  public render()
  {
    const popups: React.ReactElement<any>[] = [];
    for (const popupType in this.state)
    {
      if (this.state[popupType])
      {
        popups.push(this.makePopup(<PopupType> popupType));
      }
    }

    return(
      ReactDOMElements.div(
      {
        className: "top-menu-popups-wrapper",
      },
        popups,
      )
    );
  }

  private bindMethods()
  {
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.bringPopupToFront = this.bringPopupToFront.bind(this);
    this.toggleOrBringPopupToFront = this.toggleOrBringPopupToFront.bind(this);
    this.cacheWindowPosition = this.cacheWindowPosition.bind(this);
    this.cacheAllWindowPositions = this.cacheAllWindowPositions.bind(this);
    this.storeWindowPositions = this.storeWindowPositions.bind(this);
  }
  private closePopup(popupType: PopupType)
  {
    this.cacheWindowPosition(popupType);
    this.storeWindowPositions();

    if (popupType === "options")
    {
      options.save();
    }

    this.popupComponents[popupType] = null;

    const changedState = <Pick<OpenedPopupsState, PopupType>> {[popupType]: false};
    this.setState(changedState);
  }
  private openPopup(popupType: PopupType)
  {
    const changedState = <Pick<OpenedPopupsState, PopupType>> {[popupType]: true};
    this.setState(changedState);
  }
  private makePopup(popupType: PopupType): React.ReactElement<any>
  {
    const constructData = this.popupConstructData[popupType];

    if (!this.popupComponents[popupType])
      {
        this.popupComponents[popupType] = React.createRef<DefaultWindowComponent>();
      }

    return DefaultWindow(
    {
      key: popupType,
      ref: this.popupComponents[popupType],

      title: constructData.title,
      handleClose: () =>
      {
        this.closePopup(popupType);
      },
      getInitialPosition: !this.cachedPopupPositions[popupType] ?
        undefined :
        () =>
        {
          return this.cachedPopupPositions[popupType];
        },
    },
      constructData.makeContent(),
    );
  }
  private cacheWindowPosition(key: PopupType): void
  {
    if (this.popupComponents[key])
    {
      const popupComponent: DefaultWindowComponent = this.popupComponents[key].current;
      this.cachedPopupPositions[key] = popupComponent.windowContainerComponent.current.getPosition();
    }
  }
  private cacheAllWindowPositions(): void
  {
    for (const key in this.popupComponents)
    {
      this.cacheWindowPosition(<PopupType>key);
    }
  }
  private storeWindowPositions(): void
  {
    localForage.setItem(storageStrings.windowPositions, JSON.stringify(this.cachedPopupPositions));
  }
}

export const TopMenuPopups: React.Factory<PropTypes> = React.createFactory(TopMenuPopupsComponent);
