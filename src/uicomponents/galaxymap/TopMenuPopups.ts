/// <reference path="../../../lib/react-global.d.ts" />

import Game from "../../Game";
import Options from "../../Options";
import Player from "../../Player";
import {Rect} from "../../Rect";

import {Language} from "../../localization/Language";

import {default as DefaultWindow, DefaultWindowComponent} from "../windows/DefaultWindow";

import DiplomacyOverview from "../diplomacy/DiplomacyOverview";

import ProductionOverview from "../production/ProductionOverview";

import LoadGame from "../saves/LoadGame";
import SaveGame from "../saves/SaveGame";

import TechnologiesList from "../technologies/TechnologiesList";

import ItemEquip from "../unitlist/ItemEquip";

import EconomySummary from "./EconomySummary";
import OptionsList from "./OptionsList";


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
}

type StateType = Partial<ValuesByPopup<boolean>>;

export class TopMenuPopupsComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "TopMenuPopups";
  public state: StateType;

  private popupConstructData: ValuesByPopup<PopupConstructData> =
  {
    production:
    {
      makeContent: () => ProductionOverview(
      {
        player: this.props.player,
      }),
      title: "Production",

      // if (!popupProps.initialPosition.width)
      // {
      //   popupProps.initialPosition.width = 600;
      //   // popupProps.initialPosition.height = 300;
      // }
    },
    equipItems:
    {
      makeContent: () => ItemEquip(
      {
        player: this.props.player,
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Equip",
      // popupProps.minWidth = 440;
    },
    economySummary:
    {
      makeContent: () => EconomySummary(
      {
        player: this.props.player,
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Economy",
    },
    saveGame:
    {
      makeContent: () => SaveGame(
      {
        handleClose: this.closePopup.bind(this, "saveGame"),
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Save",
    },
    loadGame:
    {
      makeContent: () => LoadGame(
      {
        handleClose: this.closePopup.bind(this, "loadGame"),
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Load",
    },
    options:
    {
      makeContent: () => OptionsList(
      {
        log: this.props.game.notificationLog,
        activeLanguage: this.props.activeLanguage,
      }),
      title: "Options",
    },
    diplomacy:
    {
      makeContent: () => DiplomacyOverview(
      {
        player: this.props.player,
        totalPlayerCount: this.props.game.playerOrder.length,
        metPlayers: this.props.player.diplomacyStatus.metPlayers,
        statusByPlayer: this.props.player.diplomacyStatus.statusByPlayer,
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Diplomacy",
    },
    technologies:
    {
      makeContent: () => TechnologiesList(
      {
        playerTechnology: this.props.player.playerTechnology,
        // activeLanguage: this.props.activeLanguage,
      }),
      title: "Technology",
      // popupProps.minWidth = 430;
    },
  };
  private popupComponents: Partial<ValuesByPopup<DefaultWindowComponent>> = {};
  private cachedPopupPositions: Partial<ValuesByPopup<Rect>> = {};

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
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
  public render()
  {
    const popups: React.ReactElement<any>[] = [];
    for (let popupType in this.state)
    {
      if (this.state[popupType])
      {
        popups.push(this.makePopup(<PopupType>popupType));
      }
    }

    return(
      React.DOM.div(
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
    const popupComponent = this.popupComponents[popupType];
    this.cachedPopupPositions[popupType] = popupComponent.windowContainerComponent.getPosition();

    if (popupType === "options")
    {
      Options.save();
    }

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

    return DefaultWindow(
    {
      key: popupType,
      title: constructData.title,
      handleClose: () =>
      {
        this.closePopup(popupType);
      },
      getInitialPosition: !this.cachedPopupPositions[popupType] ?
        undefined :
        (ownRect, container) =>
        {
          return this.cachedPopupPositions[popupType];
        },

      minWidth: 150,
      minHeight: 100,
    },
      constructData.makeContent(),
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupsComponent);
export default Factory;
