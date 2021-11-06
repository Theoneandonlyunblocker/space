import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Player} from "core/src/player/Player";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";
import {DefaultWindow} from "../windows/DefaultWindow";

import {DiplomacyActions} from "./DiplomacyActions";
import {DiplomaticStatusPlayer, PropTypes as DiplomaticStatusPlayerProps} from "./DiplomaticStatusPlayer";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  highlightedPlayer?: Player;
}

interface StateType
{
  playersWithOpenedDiplomacyActionsPopup: Player[];
}

export class DiplomacyOverviewComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DiplomacyOverview";
  public state: StateType;

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
    const metPlayers = this.props.player.diplomacy.getMetPlayers();

    const alivePlayers = metPlayers.filter(player => !player.isDead);
    const deadPlayers = metPlayers.filter(player => player.isDead);

    let selected: ListItem<DiplomaticStatusPlayerProps> | null = null;

    const rows: ListItem<DiplomaticStatusPlayerProps>[] = alivePlayers.map(player =>
    {
      const status = this.props.player.diplomacy.getStatusWithPlayer(player)!;

      const row =
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.baseName,
          status: status,
          opinion: player.diplomacy.getOpinionOf(this.props.player),
          flag: player.flag,
          canInteractWith: this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),

          attitudeModifiers: player.diplomacy.getAttitudeModifiersForPlayer(this.props.player)!,
        }),
      };

      if (player === this.props.highlightedPlayer)
      {
        selected = row;
      }

      return row;
    }).concat(deadPlayers.map(player =>
    {
      return(
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.baseName,
          status: "dead",
          opinion: null,
          flag: player.flag,
          canInteractWith: this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),
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
        label: localize("displayName").toString(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("diplomaticStatus").toString(),
        key: "status",
        defaultOrder: "desc",
        // most peaceful == highest
        sortingFunction: (a, b) =>
        {
          function getSortingValue(item: ListItem<DiplomaticStatusPlayerProps>): number
          {
            return item.content.props.status === "dead" ? -Infinity : item.content.props.status;
          }

          return getSortingValue(b) - getSortingValue(a);
        },
        propToSortBy: "statusSortingNumber",
      },
      {
        label: localize("opinion").toString(),
        key: "opinion",
        defaultOrder: "desc",
      },
    ];

    return(
      ReactDOMElements.div({className: "diplomacy-overview"},
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
        ReactDOMElements.div({className: "diplomacy-status-list"},
          List(
          {
            listItems: rows,
            initialColumns: columns,
            initialSortOrder: [columns[2], columns[1]],
            initialSelected: selected,
            onRowChange: this.toggleDiplomacyActionsPopup,
            addSpacer: true,
          }),
        ),
      )
    );
  }
  public openDiplomacyActionsPopup(player: Player): void
  {
    this.setState(
    {
      playersWithOpenedDiplomacyActionsPopup:
        this.state.playersWithOpenedDiplomacyActionsPopup.concat(player),
    });
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

export const DiplomacyOverview: React.Factory<PropTypes> = React.createFactory(DiplomacyOverviewComponent);
