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
  metPlayers: {[id: number]: Player};
  totalPlayerCount: number;
  statusByPlayer: {[id: number]: DiplomacyState};
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
    const unmetPlayerCount = this.props.totalPlayerCount -
      Object.keys(this.props.metPlayers).length - 1;

    const rows: ListItem<DiplomaticStatusPlayerProps>[] = [];

    for (let playerId in this.props.statusByPlayer)
    {
      const player = this.props.metPlayers[playerId];
      const status = this.props.player.diplomacyStatus.statusByPlayer[playerId];

      rows.push(
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.fullName,
          status: DiplomacyState[status],
          opinion: player.diplomacyStatus.getOpinionOf(this.props.player),
          flag: player.flag,

          baseOpinion: player.diplomacyStatus.getBaseOpinion(),
          statusSortingNumber: status,
          attitudeModifiers:
            player.diplomacyStatus.attitudeModifiersByPlayer[this.props.player.id],
        }),
      });
    }

    for (let i = 0; i < unmetPlayerCount; i++)
    {
      rows.push(
      {
        key: "unmet" + i,
        content: DiplomaticStatusPlayer(
        {
          player: null,
          name: "?????",
          status: "unmet",
          statusSortingNumber: 99999 + i,
          opinion: null,
        }),
      });
    }

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
        defaultOrder: "asc",
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

            minWidth: 200,
            minHeight: 200,
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
            initialSortOrder: [columns[1]],
            onRowChange: this.toggleDiplomacyActionsPopup,
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
