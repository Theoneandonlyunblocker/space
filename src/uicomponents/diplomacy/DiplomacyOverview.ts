/// <reference path="../../../lib/react-0.13.3.d.ts" />
import ListColumn from "../unitlist/ListColumn"; // TODO refactor | autogenerated
import ListItem from "../unitlist/ListItem"; // TODO refactor | autogenerated

import List from "../unitlist/List";
import DiplomacyActions from "./DiplomacyActions";
import Opinion from "./Opinion";
import DiplomaticStatusPlayer from "./DiplomaticStatusPlayer";
import DiplomacyState from "../../DiplomacyState";
import Player from "../../Player";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";


interface PropTypes extends React.Props<any>
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
  
  ref_TODO_popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeDiplomacyActionsPopup = this.makeDiplomacyActionsPopup.bind(this);    
  }
  
  makeDiplomacyActionsPopup(rowItem: ListItem)
  {
    var player = rowItem.data.player;
    if (!player) return;

    this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: DiplomacyActions,
      contentProps:
      {
        player: this.props.player,
        targetPlayer: player,
        onUpdate: this.forceUpdate.bind(this)
      },
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

    var rows: ListItem[] = [];

    for (var playerId in this.props.statusByPlayer)
    {
      var player = this.props.metPlayers[playerId];
      var status = this.props.player.diplomacyStatus.statusByPlayer[playerId];

      rows.push(
      {
        key: player.id,
        data:
        {
          player: player,
          name: player.name,
          baseOpinion: player.diplomacyStatus.getBaseOpinion(),
          status: DiplomacyState[status],
          statusEnum: status,
          opinion: player.diplomacyStatus.getOpinionOf(this.props.player),
          attitudeModifiers:
            player.diplomacyStatus.attitudeModifiersByPlayer[this.props.player.id],
          rowConstructor: DiplomaticStatusPlayer
        }
      });
    }

    for (var i = 0; i < unmetPlayerCount; i++)
    {
      rows.push(
      {
        key: "unmet" + i,
        data:
        {
          name: "?????",
          status: "unmet",
          statusEnum: 99999 + i,
          opinion: null,

          rowConstructor: DiplomaticStatusPlayer
        }
      });
    }

    var columns: ListColumn[] =
    [
      {
        label: "",
        key: "flag",
        defaultOrder: "asc",
        propToSortBy: "name"
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
        propToSortBy: "statusEnum"
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
            this.ref_TODO_popupManager = component;
          },
          onlyAllowOne: true
        }),
        React.DOM.div({className: "diplomacy-status-list fixed-table-parent"},
          List(
          {
            listItems: rows,
            initialColumns: columns,
            initialSortOrder: [columns[0]],
            onRowChange: this.makeDiplomacyActionsPopup
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DiplomacyOverviewComponent);
export default Factory;
