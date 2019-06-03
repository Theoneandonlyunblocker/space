import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Player from "../../../../src/Player";

import TradeOverview from "../trade/TradeOverview";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  closePopup?: () => void;
  player: Player;
  targetPlayer: Player;
  onUpdate: () => void;
}

interface StateType
{
  hasTradePopup: boolean;
}

export class DiplomacyActionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DiplomacyActions";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasTradePopup: false,
    };

    this.bindMethods();
  }

  public render()
  {
    const player = this.props.player;
    const targetPlayer = this.props.targetPlayer;


    const declareWarProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
    {
      className: "diplomacy-action-button",
    };

    if (player.diplomacy.canDeclareWarOn(targetPlayer))
    {
      declareWarProps.onClick = this.handleDeclareWar;
    }
    else
    {
      declareWarProps.disabled = true;
      declareWarProps.className += " disabled";
    }

    const makePeaceProps: React.ButtonHTMLAttributes<HTMLButtonElement> =
    {
      className: "diplomacy-action-button",
    };

    if (player.diplomacy.canMakePeaceWith(targetPlayer))
    {
      makePeaceProps.onClick = this.handleMakePeace;
    }
    else
    {
      makePeaceProps.disabled = true;
      makePeaceProps.className += " disabled";
    }

    return(
      ReactDOMElements.div(
      {
        className: "diplomacy-actions",
      },
        ReactDOMElements.button(declareWarProps,
          localize("declareWar")(),
        ),
        ReactDOMElements.button(makePeaceProps,
          localize("makePeace")(),
        ),
        ReactDOMElements.button(
        {
          className: "diplomacy-action-button",
          onClick: this.toggleTradePopup,
        },
          localize("trade_action")(),
        ),
        !this.state.hasTradePopup ? null :
          DefaultWindow(
          {
            handleClose: this.closeTradePopup,
            title: localize("tradeWindowTitle")(),
          },
            TradeOverview(
            {
              selfPlayer: this.props.player,
              otherPlayer: this.props.targetPlayer,
              handleClose: this.closeTradePopup,
            }),
          ),
    ));
  }

  private bindMethods()
  {
    this.openTradePopup = this.openTradePopup.bind(this);
    this.closeTradePopup = this.closeTradePopup.bind(this);
    this.toggleTradePopup = this.toggleTradePopup.bind(this);
    this.handleMakePeace = this.handleMakePeace.bind(this);
    this.handleDeclareWar = this.handleDeclareWar.bind(this);
  }
  private openTradePopup(): void
  {
    this.setState({hasTradePopup: true});
  }
  private closeTradePopup(): void
  {
    this.setState({hasTradePopup: false});
  }
  private toggleTradePopup(): void
  {
    if (this.state.hasTradePopup)
    {
      this.closeTradePopup();
    }
    else
    {
      this.openTradePopup();
    }
  }
  private handleDeclareWar()
  {
    this.props.player.diplomacy.declareWarOn(this.props.targetPlayer);
    this.props.onUpdate();
  }
  private handleMakePeace()
  {
    this.props.player.diplomacy.makePeaceWith(this.props.targetPlayer);
    this.props.onUpdate();
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(DiplomacyActionsComponent);
export default factory;
