/// <reference path="defencebuilding.ts"/>

module Rance
{
  export module UIComponents
  {
    export var DefenceBuildingList= React.createClass(
    {
      displayName: "DefenceBuildingList",
      render: function()
      {
        if (!this.props.buildings) return null;
        
        var buildings = [];

        for (var i = 0; i < this.props.buildings.length; i++)
        {
          buildings.push(UIComponents.DefenceBuilding(
          {
            key: i,
            building: this.props.buildings[i]
          }));
        }

        return(
          React.DOM.div(
          {
            className: "defence-building-list"
          },
            buildings
          )
        );
      }

    });
  }
}
