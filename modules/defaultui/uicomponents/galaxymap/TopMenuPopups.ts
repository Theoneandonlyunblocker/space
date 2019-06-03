import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as localForage from "localforage";

import {localize} from "../../localization/localize";
import Game from "../../../../src/Game";
import Options from "../../../../src/Options";
import Player from "../../../../src/Player";
import {Rect} from "../../../../src/Rect";
import Star from "../../../../src/Star";
import {Language} from "../../../../src/localization/Language";
import DiplomacyOverview from "../diplomacy/DiplomacyOverview";
import ProductionOverview from "../production/ProductionOverview";
import LoadGame from "../saves/LoadGame";
import SaveGame from "../saves/SaveGame";
import TechnologiesList from "../technologies/TechnologiesList";
import ItemEquip from "../unitlist/ItemEquip";
import {default as DefaultWindow, DefaultWindowComponent} from "../windows/DefaultWindow";

import EconomySummary from "./EconomySummary";
import FullOptionsList from "../options/FullOptionsList";
import { storageStrings } from "../../../../src/storageStrings";


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

type StateType = Partial<ValuesByPopup<boolean>>;

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
      title: localize("production")(),
    },
    equipItems:
    {
      makeContent: () => ItemEquip(
      {
        player: this.props.player,
      }),
      title: localize("equip")(),
    },
    economySummary:
    {
      makeContent: () => EconomySummary(
      {
        player: this.props.player,
      }),
      title: localize("economy")(),
    },
    saveGame:
    {
      makeContent: () => SaveGame(
      {
        handleClose: this.closePopup.bind(this, "saveGame"),
      }),
      title: localize("save_action")(),
    },
    loadGame:
    {
      makeContent: () => LoadGame(
      {
        handleClose: this.closePopup.bind(this, "loadGame"),
      }),
      title: localize("load_action")(),
    },
    options:
    {
      makeContent: () => FullOptionsList(
      {
        activeLanguage: this.props.activeLanguage,
      }),
      title: localize("options")(),
    },
    diplomacy:
    {
      makeContent: () => DiplomacyOverview(
      {
        player: this.props.player,
      }),
      title: localize("diplomacy")(),
    },
    technologies:
    {
      makeContent: () => TechnologiesList(
      {
        playerTechnology: this.props.player.playerTechnology,
      }),
      title: localize("technology")(),
    },
  };

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

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
  private getInitialStateTODO(): StateType
  {
    return(
    {
      production: false,
      equipItems: false,
      economySummary: false,
      saveGame: false,
      loadGame: false,
      options: false,
      diplomacy: false,
      technologies: false,
    });
  }
  private closePopup(popupType: PopupType)
  {
    this.cacheWindowPosition(popupType);
    this.storeWindowPositions();

    if (popupType === "options")
    {
      Options.save();
    }

    this.popupComponents[popupType] = null;

    const stateObj: StateType = {};
    stateObj[popupType] = false;
    this.setState(stateObj);
  }
  private openPopup(popupType: PopupType)
  {
    const stateObj: StateType = {};
    stateObj[popupType] = true;
    this.setState(stateObj);
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

const factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupsComponent);
export default factory;
