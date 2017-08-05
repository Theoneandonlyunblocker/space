import * as React from "react";

import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import DiplomacyActions from "./DiplomacyActions";
import {default as DiplomaticStatusPlayer, PropTypes as DiplomaticStatusPlayerProps} from "./DiplomaticStatusPlayer";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import DiplomacyState from "../../DiplomacyState";
import Player from "../../Player";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
  playersWithOpenedDiplomacyActionsPopup: Player[];
}

export class DiplomacyOverviewComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "DiplomacyOverview";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      playersWithOpenedDiplomacyActionsPopup: [],
    };

    this.bindMethods();
  }

  public render()
  {
    // TODO 2017.07.26 | handle dead players
    const metPlayers = this.props.player.diplomacyStatus.getMetPlayers();

    const alivePlayers = metPlayers.filter(player => !player.isDead);
    const deadPlayers = metPlayers.filter(player => player.isDead);

    const rows: ListItem<DiplomaticStatusPlayerProps>[] = alivePlayers.map(player =>
    {
      const status = this.props.player.diplomacyStatus.statusByPlayer.get(player);

      return(
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.fullName,
          status: DiplomacyState[status],
          opinion: player.diplomacyStatus.getOpinionOf(this.props.player),
          flag: player.flag,
          canInteractWith: this.props.player.diplomacyStatus.canDoDiplomacyWithPlayer(player),

          baseOpinion: player.diplomacyStatus.getBaseOpinion(),
          statusSortingNumber: status,
          attitudeModifiers: player.diplomacyStatus.attitudeModifiersByPlayer.get(this.props.player),
        }),
      });
    }).concat(deadPlayers.map(player =>
    {
      return(
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.fullName,
          status: localize("deadPlayer"),
          opinion: null,
          flag: player.flag,
          canInteractWith: this.props.player.diplomacyStatus.canDoDiplomacyWithPlayer(player),

          statusSortingNumber: -99999,
        }),
      });
    }));

    const columns: ListColumn<DiplomaticStatusPlayerProps>[] =
    [
      {
        label: "",
        key: "flag",
        defaultOrder: "asc",
        notSortable: true,
      },
      {
        label: localize("displayName"),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("diplomaticStatus"),
        key: "status",
        defaultOrder: "desc",
        propToSortBy: "statusSortingNumber",
      },
      {
        label: localize("opinion"),
        key: "opinion",
        defaultOrder: "desc",
      },
    ];

    return(
      React.DOM.div({className: "diplomacy-overview"},
        this.state.playersWithOpenedDiplomacyActionsPopup.map(targetPlayer =>
        {
          return DefaultWindow(
          {
            key: targetPlayer.id,

            handleClose: this.closeDiplomacyActionsPopup.bind(null, targetPlayer),
            title: `${targetPlayer.name}`,
            isResizable: false,
          },
            DiplomacyActions(
            {
              player: this.props.player,
              targetPlayer: targetPlayer,
              onUpdate: this.forceUpdate.bind(this),
            }),
          );
        }),
        React.DOM.div({className: "diplomacy-status-list fixed-table-parent"},
          List(
          {
            listItems: rows,
            initialColumns: columns,
            initialSortOrder: [columns[2], columns[1]],
            onRowChange: this.toggleDiplomacyActionsPopup,
            addSpacer: true,
          }),
        ),
      )
    );
  }

  private bindMethods(): void
  {
    this.hasDiplomacyActionsPopup = this.hasDiplomacyActionsPopup.bind(this);
    this.openDiplomacyActionsPopup = this.openDiplomacyActionsPopup.bind(this);
    this.closeDiplomacyActionsPopup = this.closeDiplomacyActionsPopup.bind(this);
    this.toggleDiplomacyActionsPopup = this.toggleDiplomacyActionsPopup.bind(this);
  }
  private hasDiplomacyActionsPopup(player: Player): boolean
  {
    return this.state.playersWithOpenedDiplomacyActionsPopup.indexOf(player) !== -1;
  }
  private openDiplomacyActionsPopup(player: Player): void
  {
    this.setState(
    {
      playersWithOpenedDiplomacyActionsPopup:
        this.state.playersWithOpenedDiplomacyActionsPopup.concat(player),
    });
  }
  private closeDiplomacyActionsPopup(playerToCloseFor: Player): void
  {
    this.setState(
    {
      playersWithOpenedDiplomacyActionsPopup:
        this.state.playersWithOpenedDiplomacyActionsPopup.filter(player =>
        {
          return player !== playerToCloseFor;
        }),
    });
  }
  private toggleDiplomacyActionsPopup(rowItem: ListItem<DiplomaticStatusPlayerProps>): void
  {
    const player = rowItem.content.props.player;
    if (this.hasDiplomacyActionsPopup(player))
    {
      this.closeDiplomacyActionsPopup(player);
    }
    else
    {
      this.openDiplomacyActionsPopup(player);
    }
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyOverviewComponent);
export default Factory;
