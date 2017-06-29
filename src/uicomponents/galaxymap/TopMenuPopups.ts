/// <reference path="../../../lib/react-global.d.ts" />

import Game from "../../Game";
import Options from "../../Options";
import Player from "../../Player";

import DiplomacyOverview from "../diplomacy/DiplomacyOverview";

import {Language} from "../../localization/Language";

import {CustomPopupProps} from "../popups/Popup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import TopMenuPopup from "../popups/TopMenuPopup";

import ProductionOverview from "../production/ProductionOverview";

import LoadGame from "../saves/LoadGame";
import SaveGame from "../saves/SaveGame";

import TechnologiesList from "../technologies/TechnologiesList";

import ItemEquip from "../unitlist/ItemEquip";

import EconomySummary from "./EconomySummary";
import OptionsList from "./OptionsList";

export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
  activeLanguage: Language;
}

interface StateType
{
}

export class TopMenuPopupsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenuPopups";
  cachedPopupRects:
  {
    [popupType: string]: ClientRect;
  } = {};

  state: StateType;
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      production: undefined,
      equipItems: undefined,
      economySummary: undefined,
      saveGame: undefined,
      loadGame: undefined,
      options: undefined,
      diplomacy: undefined,
      technologies: undefined,
    });
  }
  closePopup(popupType: string)
  {
    const popupComponent = this.popupManager.popupComponentsByID[this.state[popupType]];
    const popupNode = ReactDOM.findDOMNode(popupComponent);
    this.cachedPopupRects[popupType] = popupNode.getBoundingClientRect();

    this.popupManager.closePopup(this.state[popupType]);
    const stateObj: StateType = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);

    if (popupType === "options")
    {
      Options.save();
    }
  }

  makePopup(popupType: string)
  {
    let content: React.ReactElement<any>;
    let popupTitle: string;

    const popupProps: CustomPopupProps =
    {
      resizable: true,
      minWidth: 150,
      minHeight: 100,
      initialPosition: this.cachedPopupRects[popupType] || {},

      dragPositionerProps:
      {
        preventAutoResize: true,
        containerDragOnly: true,
      },
    };

    switch (popupType)
    {
      case "production":
      {
        content = ProductionOverview(
        {
          player: this.props.player,
        });
        popupTitle = "Production";

        if (!popupProps.initialPosition.width)
        {
          popupProps.initialPosition.width = 600;
          // popupProps.initialPosition.height = 300;
        }
        break;
      }
      case "equipItems":
      {
        content = ItemEquip(
        {
          player: this.props.player,
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Equip";
        popupProps.minWidth = 440;
        break;
      }
      case "economySummary":
      {
        content = EconomySummary(
        {
          player: this.props.player,
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Economy";
        break;
      }
      case "saveGame":
      {
        content = SaveGame(
        {
          handleClose: this.closePopup.bind(this, "saveGame"),
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Save";
        break;
      }
      case "loadGame":
      {
        content = LoadGame(
        {
          handleClose: this.closePopup.bind(this, "loadGame"),
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Load";
        break;
      }
      case "options":
      {
        content = OptionsList(
        {
          log: this.props.game.notificationLog,
          activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Options";
        break;
      }
      case "diplomacy":
      {
        content = DiplomacyOverview(
        {
          player: this.props.player,
          totalPlayerCount: this.props.game.playerOrder.length,
          metPlayers: this.props.player.diplomacyStatus.metPlayers,
          statusByPlayer: this.props.player.diplomacyStatus.statusByPlayer,
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Diplomacy";
        break;
      }
      case "technologies":
      {
        content = TechnologiesList(
        {
          playerTechnology: this.props.player.playerTechnology,
          // activeLanguage: this.props.activeLanguage,
        });
        popupTitle = "Technology";
        popupProps.minWidth = 430;
        break;
      }
    }

    const id = this.popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        content: content,
        handleClose: this.closePopup.bind(this, popupType),
        title: popupTitle,
      }),
      popupProps: popupProps,
    });

    const stateObj: StateType = {};
    stateObj[popupType] = id;
    this.setState(stateObj);
  }

  togglePopup(popupType: string)
  {
    if (isFinite(this.state[popupType]))
    {
      this.closePopup(popupType);
    }
    else
    {
      this.makePopup(popupType);
    }
  }

  render()
  {
    return(
      PopupManager(
      {
        ref: (component: PopupManagerComponent) =>
        {
          this.popupManager = component;
        },
      })
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupsComponent);
export default Factory;
