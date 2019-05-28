import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import DiplomacyState from "../../DiplomacyState";
import Player from "../../Player";
import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";
import {default as DefaultWindow} from "../windows/DefaultWindow";

import DiplomacyActions from "./DiplomacyActions";
import {default as DiplomaticStatusPlayer, PropTypes as DiplomaticStatusPlayerProps} from "./DiplomaticStatusPlayer";


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

    const rows: ListItem<DiplomaticStatusPlayerProps>[] = alivePlayers.map(player =>
    {
      const status = this.props.player.diplomacy.getStatusWithPlayer(player)!;

      return(
      {
        key: "" + player.id,
        content: DiplomaticStatusPlayer(
        {
          player: player,
          name: player.name.fullName,
          status: DiplomacyState[status],
          opinion: player.diplomacy.getOpinionOf(this.props.player),
          flag: player.flag,
          canInteractWith: this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),

          statusSortingNumber: status,
          attitudeModifiers: player.diplomacy.getAttitudeModifiersForPlayer(this.props.player)!,
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
          status: localize("deadPlayer")(),
          opinion: null,
          flag: player.flag,
          canInteractWith: this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),

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
        label: localize("displayName")(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("diplomaticStatus")(),
        key: "status",
        defaultOrder: "desc",
        propToSortBy: "statusSortingNumber",
      },
      {
        label: localize("opinion")(),
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
        ReactDOMElements.div({className: "diplomacy-status-list fixed-table-parent"},
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

const factory: React.Factory<PropTypes> = React.createFactory(DiplomacyOverviewComponent);
export default factory;
