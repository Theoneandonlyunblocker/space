/// <reference path="../../../lib/react-global.d.ts" />

import ListItem from "../list/ListItem";
import ListColumn from "../list/ListColumn";
import List from "../list/List";

import DiplomacyActions from "./DiplomacyActions";
import {default as DiplomaticStatusPlayer, PropTypes as DiplomaticStatusPlayerProps} from "./DiplomaticStatusPlayer";

import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";

import DiplomacyState from "../../DiplomacyState";
import Player from "../../Player";


export interface PropTypes extends React.Props<any>
{
  metPlayers: {[id: number]: Player};
  totalPlayerCount: number;
  statusByPlayer: {[id: number]: DiplomacyState};
  player: Player;
}

interface StateType
{
}

export class DiplomacyOverviewComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "DiplomacyOverview";
  state: StateType;
  
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeDiplomacyActionsPopup = this.makeDiplomacyActionsPopup.bind(this);    
  }
  
  makeDiplomacyActionsPopup(rowItem: ListItem<DiplomaticStatusPlayerProps>)
  {
    var player = rowItem.content.props.player;
    if (!player)
    {
      return;
    }

    this.popupManager.makePopup(
    {
      content: DiplomacyActions(
      {
        player: this.props.player,
        targetPlayer: player,
        onUpdate: this.forceUpdate.bind(this)
      }),
      popupProps:
      {
        dragPositionerProps:
        {
          preventAutoResize: true,
          containerDragOnly: true
        }
      }
    });
  }
  
  render()
  {
    var unmetPlayerCount = this.props.totalPlayerCount -
      Object.keys(this.props.metPlayers).length - 1;

    var rows: ListItem<DiplomaticStatusPlayerProps>[] = [];

    for (let playerId in this.props.statusByPlayer)
    {
      var player = this.props.metPlayers[playerId];
      var status = this.props.player.diplomacyStatus.statusByPlayer[playerId];

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
        })
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
        })
      });
    }

    var columns: ListColumn<DiplomaticStatusPlayerProps>[] =
    [
      {
        label: "",
        key: "flag",
        defaultOrder: "asc",
        notSortable: true
      },
      {
        label: "Name",
        key: "name",
        defaultOrder: "asc"
      },
      {
        label: "Status",
        key: "status",
        defaultOrder: "asc",
        propToSortBy: "statusSortingNumber"
      },
      {
        label: "Opinion",
        key: "opinion",
        defaultOrder: "desc"
      }
    ];

    return(
      React.DOM.div({className: "diplomacy-overview"},
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true
        }),
        React.DOM.div({className: "diplomacy-status-list fixed-table-parent"},
          List(
          {
            listItems: rows,
            initialColumns: columns,
            initialSortOrder: [columns[1]],
            onRowChange: this.makeDiplomacyActionsPopup
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyOverviewComponent);
export default Factory;
