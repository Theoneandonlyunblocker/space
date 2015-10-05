/// <reference path="../items/buyitems.ts"/>
/// <reference path="../saves/savegame.ts"/>
/// <reference path="../saves/loadgame.ts"/>
/// <reference path="../unitlist/itemequip.ts"/>
/// <reference path="../diplomacy/diplomacyoverview.ts"/>
/// <reference path="economysummary.ts"/>
/// <reference path="optionslist.ts"/>
/// <reference path="../technologies/technologieslist.ts" />

/// <reference path="../popups/topmenupopup.ts" />
module Rance
{
  export module UIComponents
  {
    export var TopMenuPopups = React.createClass(
    {
      displayName: "TopMenuPopups",
      getInitialState: function()
      {
        return(
        {
          equipItems: undefined,
          buyItems: undefined,
          economySummary: undefined,
          saveGame: undefined,
          loadGame: undefined,
          options: undefined,
          diplomacy: undefined,
          technologies: undefined
        });
      },
      closePopup: function(popupType: string)
      {
        this.refs.popupManager.closePopup(this.state[popupType]);
        var stateObj: any = {};
        stateObj[popupType] = undefined;
        this.setState(stateObj);

        if (popupType === "options")
        {
          saveOptions();
        }
      },

      makePopup: function(popupType: string)
      {
        var contentConstructor: ReactComponentPlaceHolder;
        var contentProps: any;
        var popupProps: any =
        {
          resizable: true,
          containerDragOnly: true,
          minWidth: 150,
          minHeight: 50
        };

        switch (popupType)
        {
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
          case "buyItems":
          {
            contentConstructor = UIComponents.BuyItems;
            contentProps =
            {
              player: this.props.player
            }
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
            popupProps.preventAutoResize = true;
            break;
          }
          case "loadGame":
          {
            contentConstructor = UIComponents.LoadGame;
            contentProps =
            {
              handleClose: this.closePopup.bind(this, "loadGame")
            }
            popupProps.preventAutoResize = true;
            break;
          }
          case "options":
          {
            contentConstructor = UIComponents.OptionsList;
            contentProps = {};
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
              player: this.props.player
            }
            popupProps.minWidth = 430;
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
      },

      togglePopup: function(popupType: string)
      {
        if (isFinite(this.state[popupType]))
        {
          this.closePopup(popupType);
        }
        else
        {
          this.makePopup(popupType);
        }
      },

      render: function()
      {
        return(
          UIComponents.PopupManager(
          {
            ref: "popupManager"
          })
        );
      }
    })
  }
}
