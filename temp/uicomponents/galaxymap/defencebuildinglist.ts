/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="defencebuilding.ts"/>

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

export default class DefenceBuildingList extends React.Component<PropTypes, {}>
{
  displayName: string = "DefenceBuildingList";
  shouldComponentUpdate(newProps: any)
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
  }
  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
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

}
