import * as React from "react";

import Player from "../../Player";

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
  hasTradePopup?: boolean;
}

export class DiplomacyActionsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "DiplomacyActions";

  state: StateType;

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


    const declareWarProps: React.HTMLAttributes<HTMLButtonElement> =
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

    const makePeaceProps: React.HTMLAttributes<HTMLButtonElement> =
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
        className: "diplomacy-actions",
      },
        React.DOM.button(declareWarProps,
          localize("declareWar"),
        ),
        React.DOM.button(makePeaceProps,
          localize("makePeace"),
        ),
        React.DOM.button(
        {
          className: "diplomacy-action-button",
          onClick: this.toggleTradePopup,
        },
          localize("trade_imperative"),
        ),
        !this.state.hasTradePopup ? null :
          DefaultWindow(
          {
            handleClose: this.closeTradePopup,
            title: localize("trade_noun"),

            minWidth: 150,
            minHeight: 50,
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
    this.props.player.diplomacyStatus.declareWarOn(this.props.targetPlayer);
    this.props.onUpdate();
  }
  private handleMakePeace()
  {
    this.props.player.diplomacyStatus.makePeaceWith(this.props.targetPlayer);
    this.props.onUpdate();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyActionsComponent);
export default Factory;
