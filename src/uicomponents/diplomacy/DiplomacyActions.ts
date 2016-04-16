/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import Player from "../../Player";
import Trade from "../../Trade";
import TradeOverview from "../trade/TradeOverview";
import TopMenuPopup from "../popups/TopMenuPopup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";


interface PropTypes extends React.Props<any>
{
  closePopup: () => void;
  player: Player;
  targetPlayer: Player;
  onUpdate: () => void;
}

interface StateType
{
  trade?: number;
}

export class DiplomacyActionsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "DiplomacyActions";

  state: StateType;
  ref_TODO_popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.handleMakePeace = this.handleMakePeace.bind(this);
    this.handleDeclareWar = this.handleDeclareWar.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      trade: undefined
    });
  }
  
  closePopup(popupType: string)
  {
    this.ref_TODO_popupManager.closePopup(this.state[popupType]);
    var stateObj: StateType = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);
  }

  makePopup(popupType: string)
  {
    var contentConstructor: React.Factory<any>;
    var contentProps: any;
    var popupProps: any =
    {
      resizable: true,
      containerDragOnly: true,
      minWidth: 150,
      minHeight: 50,
      preventAutoResize: true
    };

    switch (popupType)
    {
      case "trade":
      {
        contentConstructor = TradeOverview;
        contentProps =
        {
          selfPlayer: this.props.player,
          otherPlayer: this.props.targetPlayer,
          handleClose: this.closePopup.bind(this, popupType)
        };
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

  handleDeclareWar()
  {
    this.props.player.diplomacyStatus.declareWarOn(this.props.targetPlayer);
    this.props.onUpdate();
  }
  handleMakePeace()
  {
    this.props.player.diplomacyStatus.makePeaceWith(this.props.targetPlayer);
    this.props.onUpdate();
  }

  render()
  {
    var player = this.props.player;
    var targetPlayer = this.props.targetPlayer;


    var declareWarProps: any =
    {
      className: "diplomacy-action-button"
    };

    if (player.diplomacyStatus.canDeclareWarOn(targetPlayer))
    {
      declareWarProps.onClick = this.handleDeclareWar;
    }
    else
    {
      declareWarProps.disabled = true;
      declareWarProps.className += " disabled";
    }

    var makePeaceProps: any =
    {
      className: "diplomacy-action-button"
    };

    if (player.diplomacyStatus.canMakePeaceWith(targetPlayer))
    {
      makePeaceProps.onClick = this.handleMakePeace;
    }
    else
    {
      makePeaceProps.disabled = true;
      makePeaceProps.className += " disabled";
    }

    return(
      React.DOM.div(
      {
        className: "diplomacy-actions-container draggable-container"
      },
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.ref_TODO_popupManager = component;
          },
          onlyAllowOne: true
        }),
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.closePopup
        }, "X"),
        React.DOM.div(
        {
          className: "diplomacy-actions"
        },
          React.DOM.div(
          {
            className: "diplomacy-actions-header"
          },
            targetPlayer.name
          ),
          React.DOM.button(declareWarProps,
            "Declare war"
          ),
          React.DOM.button(makePeaceProps,
            "Make peace"
          ),
          React.DOM.button(
          {
            className: "diplomacy-action-button",
            onClick: this.togglePopup.bind(this, "trade")
          },
            "Trade"
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyActionsComponent);
export default Factory;
