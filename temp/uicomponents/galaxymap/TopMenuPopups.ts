/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../saves/savegame.ts"/>
/// <reference path="../saves/loadgame.ts"/>
/// <reference path="../unitlist/itemequip.ts"/>
/// <reference path="../diplomacy/diplomacyoverview.ts"/>
/// <reference path="economysummary.ts"/>
/// <reference path="optionslist.ts"/>
/// <reference path="../technologies/technologieslist.ts" />
/// <reference path="../production/productionoverview.ts" />

/// <reference path="../popups/topmenupopup.ts" />


import TopMenuPopup from "../popups/TopMenuPopup.ts";
import PopupManager from "../popups/PopupManager.ts";
import Player from "../../../src/Player.ts";
import Game from "../../../src/Game.ts";
import DiplomacyOverview from "../diplomacy/DiplomacyOverview.ts";
import ItemEquip from "../unitlist/ItemEquip.ts";
import EconomySummary from "./EconomySummary.ts";
import TechnologiesList from "../technologies/TechnologiesList.ts";
import ProductionOverview from "../production/ProductionOverview.ts";
import LoadGame from "../saves/LoadGame.ts";
import SaveGame from "../saves/SaveGame.ts";
import OptionsList from "./OptionsList.ts";

export interface PropTypes extends React.Props<any>
{
  player: Player;
  game: Game;
}

interface StateType
{
}

class TopMenuPopups_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenuPopups";
  cachedPopupRects: {}


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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
    var popupNode = this.refs.popupManager.refs[this.state[popupType]].getDOMNode();
    this.cachedPopupRects[popupType] = popupNode.getBoundingClientRect();

    this.refs.popupManager.closePopup(this.state[popupType]);
    var stateObj: any = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);

    if (popupType === "options")
    {
      saveOptions();
    }
  }

  makePopup(popupType: string)
  {
    if (!this.cachedPopupRects[popupType])
    {
      this.cachedPopupRects[popupType] = {};
    }

    var contentConstructor: React.ReactElement<any>;
    var contentProps: any;
    var popupProps: any =
    {
      resizable: true,
      containerDragOnly: true,
      minWidth: 150,
      minHeight: 50,
      initialPosition: this.cachedPopupRects[popupType],
      preventAutoResize: true
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
          popupProps.initialPosition.height = 300;
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

    var id = this.refs.popupManager.makePopup(
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

    var stateObj: any = {};
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
        ref: "popupManager"
      })
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopups_COMPONENT_TODO);
export default Factory;
