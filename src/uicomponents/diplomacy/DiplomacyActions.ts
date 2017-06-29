/// <reference path="../../../lib/react-global.d.ts" />

import Player from "../../Player";
import {CustomPopupProps} from "../popups/Popup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import TopMenuPopup from "../popups/TopMenuPopup";
import TradeOverview from "../trade/TradeOverview";

export interface PropTypes extends React.Props<any>
{
  closePopup?: () => void;
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
    this.handleMakePeace = this.handleMakePeace.bind(this);
    this.handleDeclareWar = this.handleDeclareWar.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      trade: undefined,
    });
  }

  closePopup(popupType: string)
  {
    this.popupManager.closePopup(this.state[popupType]);
    const stateObj: StateType = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);
  }

  makePopup(popupType: string)
  {
    let content: React.ReactElement<any>;

    const popupProps: CustomPopupProps =
    {
      resizable: true,
      minWidth: 150,
      minHeight: 50,
      dragPositionerProps:
      {
        containerDragOnly: true,
        preventAutoResize: true,
      },
    };

    switch (popupType)
    {
      case "trade":
      {
        content = TradeOverview(
        {
          selfPlayer: this.props.player,
          otherPlayer: this.props.targetPlayer,
          handleClose: this.closePopup.bind(this, popupType),
        });
        break;
      }
    }

    const id = this.popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        content: content,
        handleClose: this.closePopup.bind(this, popupType),
        title: "Diplomacy",
      }),
      popupProps: popupProps,
    });

    const stateObj: any = {};
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
    const player = this.props.player;
    const targetPlayer = this.props.targetPlayer;


    const declareWarProps: any =
    {
      className: "diplomacy-action-button",
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

    const makePeaceProps: any =
    {
      className: "diplomacy-action-button",
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
        className: "diplomacy-actions-container draggable-container",
      },
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true,
        }),
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.closePopup,
        }, "X"),
        React.DOM.div(
        {
          className: "diplomacy-actions",
        },
          React.DOM.div(
          {
            className: "diplomacy-actions-header",
          },
            targetPlayer.name.fullName,
          ),
          React.DOM.button(declareWarProps,
            "Declare war",
          ),
          React.DOM.button(makePeaceProps,
            "Make peace",
          ),
          React.DOM.button(
          {
            className: "diplomacy-action-button",
            onClick: this.togglePopup.bind(this, "trade"),
          },
            "Trade",
          ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyActionsComponent);
export default Factory;
