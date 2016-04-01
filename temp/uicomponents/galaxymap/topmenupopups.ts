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
export interface PropTypes
{
  player: Player;
  game: Game;
}

export default class TopMenuPopups extends React.Component<PropTypes, {}>
{
  displayName: string = "TopMenuPopups";
  cachedPopupRects: {}


  getInitialState()
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

    var contentConstructor: ReactComponentPlaceHolder;
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
        contentConstructor = UIComponents.ProductionOverview;
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
        contentConstructor = UIComponents.ItemEquip;
        contentProps =
        {
          player: this.props.player
        };
        popupProps.minWidth = 440;
        break;
      }
      case "economySummary":
      {
        contentConstructor = UIComponents.EconomySummary;
        contentProps =
        {
          player: this.props.player
        }
        break;
      }
      case "saveGame":
      {
        contentConstructor = UIComponents.SaveGame;
        contentProps =
        {
          handleClose: this.closePopup.bind(this, "saveGame")
        }
        break;
      }
      case "loadGame":
      {
        contentConstructor = UIComponents.LoadGame;
        contentProps =
        {
          handleClose: this.closePopup.bind(this, "loadGame")
        }
        break;
      }
      case "options":
      {
        contentConstructor = UIComponents.OptionsList;
        contentProps =
        {
          log: this.props.game.notificationLog
        };
        break;
      }
      case "diplomacy":
      {
        contentConstructor = UIComponents.DiplomacyOverview;
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
        contentConstructor = UIComponents.TechnologiesList;
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
      contentConstructor: UIComponents.TopMenuPopup,
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
      UIComponents.PopupManager(
      {
        ref: "popupManager"
      })
    );
  }
}
