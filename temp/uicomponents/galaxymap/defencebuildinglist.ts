/// <reference path="defencebuilding.ts"/>

export namespace UIComponents
{
  export var DefenceBuildingList= React.createFactory(React.createClass(
  {
    displayName: "DefenceBuildingList",
    shouldComponentUpdate: function(newProps: any)
    {
      var newBuildings = newProps.buildings;
      var oldBuildings = this.props.buildings;
      if (newBuildings.length !== oldBuildings.length) return true;
      else
      {
        for (var i = 0; i < newBuildings.length; i++)
        {
          if (oldBuildings.indexOf(newBuildings[i]) === -1) return true;
        }
      }

      return false;
    },
    render: function()
    {
      if (!this.props.buildings) return null;
      
      var buildings: ReactComponentPlaceHolder[] = [];

      for (var i = 0; i < this.props.buildings.length; i++)
      {
        buildings.push(UIComponents.DefenceBuilding(
        {
          key: this.props.buildings[i].id,
          building: this.props.buildings[i]
        }));
      }

      if (this.props.reverse)
      {
        buildings.reverse();
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

  }));
}
