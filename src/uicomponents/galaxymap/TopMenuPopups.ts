/// <reference path="../../../lib/react-global.d.ts" />

import TopMenuPopup from "../popups/TopMenuPopup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import Player from "../../Player";
import Game from "../../Game";
import DiplomacyOverview from "../diplomacy/DiplomacyOverview";
import ItemEquip from "../unitlist/ItemEquip";
import EconomySummary from "./EconomySummary";
import TechnologiesList from "../technologies/TechnologiesList";
import ProductionOverview from "../production/ProductionOverview";
import LoadGame from "../saves/LoadGame";
import SaveGame from "../saves/SaveGame";
import OptionsList from "./OptionsList";
import Options from "../../Options";
import {CustomPopupProps} from "../popups/popup";

interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
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
  ref_TODO_popupManager: PopupManagerComponent;

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
      technologies: undefined
    });
  }
  closePopup(popupType: string)
  {
    const popupComponent = this.ref_TODO_popupManager.popupComponentsByID[this.state[popupType]];
    const popupNode = ReactDOM.findDOMNode(popupComponent);
    this.cachedPopupRects[popupType] = popupNode.getBoundingClientRect();

    this.ref_TODO_popupManager.closePopup(this.state[popupType]);
    var stateObj: StateType = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);

    if (popupType === "options")
    {
      Options.save();
    }
  }

  makePopup(popupType: string)
  {
    var contentConstructor: React.Factory<any>;
    var contentProps: any;
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
      }
    };

    switch (popupType)
    {
      case "production":
      {
        contentConstructor = ProductionOverview;
        contentProps =
        {
          player: this.props.player
        };

        if (!popupProps.initialPosition.width)
        {
          popupProps.initialPosition.width = 600;
          // popupProps.initialPosition.height = 300;
        }
        break;
      }
      case "equipItems":
      {
        contentConstructor = ItemEquip;
        contentProps =
        {
          player: this.props.player
        };
        popupProps.minWidth = 440;
        break;
      }
      case "economySummary":
      {
        contentConstructor = EconomySummary;
        contentProps =
        {
          player: this.props.player
        }
        break;
      }
      case "saveGame":
      {
        contentConstructor = SaveGame;
        contentProps =
        {
          handleClose: this.closePopup.bind(this, "saveGame")
        }
        break;
      }
      case "loadGame":
      {
        contentConstructor = LoadGame;
        contentProps =
        {
          handleClose: this.closePopup.bind(this, "loadGame")
        }
        break;
      }
      case "options":
      {
        contentConstructor = OptionsList;
        contentProps =
        {
          log: this.props.game.notificationLog
        };
        break;
      }
      case "diplomacy":
      {
        contentConstructor = DiplomacyOverview;
        contentProps =
        {
          player: this.props.player,
          totalPlayerCount: this.props.game.playerOrder.length,
          metPlayers: this.props.player.diplomacyStatus.metPlayers,
          statusByPlayer: this.props.player.diplomacyStatus.statusByPlayer
        }
        break;
      }
      case "technologies":
      {
        contentConstructor = TechnologiesList;
        contentProps =
        {
          playerTechnology: this.props.player.playerTechnology
        }
        popupProps.minWidth = 430;
        break;
      }
    }

    var id = this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: TopMenuPopup,
      contentProps:
      {
        contentConstructor: contentConstructor,
        contentProps: contentProps,
        handleClose: this.closePopup.bind(this, popupType)
      },
      popupProps: popupProps
    });

    var stateObj: StateType = {};
    stateObj[popupType] = id;
    this.setState(stateObj)
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
          this.ref_TODO_popupManager = component;
        }
      })
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupsComponent);
export default Factory;
