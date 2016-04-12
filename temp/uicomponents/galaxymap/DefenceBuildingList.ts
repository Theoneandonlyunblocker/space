/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="defencebuilding.ts"/>


import DefenceBuilding from "./DefenceBuilding.ts";


export interface PropTypes extends React.Props<any>
{
  buildings: any; // TODO refactor | define prop type 123
  reverse: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class DefenceBuildingList_COMPONENT_TODO extends React.Component<PropTypes, StateType>
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
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    if (!this.props.buildings) return null;
    
    var buildings: React.ReactElement<any>[] = [];

    for (var i = 0; i < this.props.buildings.length; i++)
    {
      buildings.push(DefenceBuilding(
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

const Factory: React.Factory<PropTypes> = React.createFactory(DefenceBuildingList_COMPONENT_TODO);
export default Factory;
