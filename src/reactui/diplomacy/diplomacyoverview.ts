/// <reference path="diplomaticstatusplayer.ts" />

module Rance
{
  export module UIComponents
  {
    export var DiplomacyOverview = React.createClass(
    {
      displayName: "DiplomacyOverview",
      render: function()
      {
        var unmetPlayerCount = this.props.totalPlayerCount -
          Object.keys(this.props.metPlayers).length - 1;

        var rows = [];

        for (var playerId in this.props.statusByPlayer)
        {
          var player = this.props.metPlayers[playerId];

          rows.push(
          {
            key: player.id,
            data:
            {
              name: player.name,
              status: DiplomaticState[this.props.statusByPlayer[playerId]],
              statusEnum: this.props.statusByPlayer[playerId],
              opinion: player.diplomacyStatus.getOpinionOf(this.props.player),
              attitudeModifiers:
                player.diplomacyStatus.attitudeModifiersByPlayer[this.props.player.id],

              rowConstructor: UIComponents.DiplomaticStatusPlayer
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

              rowConstructor: UIComponents.DiplomaticStatusPlayer
            }
          });
        }

        var columns: any =
        [
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
          React.DOM.div({className: "diplomacy-status-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[0]]
            })
          )
        );
      }
    })
  }
}
