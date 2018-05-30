import * as React from "react";

import Building from "../../Building";
import DefenceBuilding from "./DefenceBuilding";


export interface PropTypes extends React.Props<any>
{
  buildings: Building[];
  reverse?: boolean;
}

interface StateType
{
}

export class DefenceBuildingListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DefenceBuildingList";
  shouldComponentUpdate(newProps: PropTypes)
  {
    const newBuildings = newProps.buildings;
    const oldBuildings = this.props.buildings;
    if (newBuildings.length !== oldBuildings.length) { return true; }
    else
    {
      for (let i = 0; i < newBuildings.length; i++)
      {
        if (oldBuildings.indexOf(newBuildings[i]) === -1) { return true; }
      }
    }

    return false;
  }
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    if (!this.props.buildings)
    {
      return null;
    }

    const buildings = this.props.buildings.map(building =>
    {
      return DefenceBuilding(
      {
        key: building.id,
        building: building,
      });
    });

    if (this.props.reverse)
    {
      buildings.reverse();
    }

    return(
      React.DOM.div(
      {
        className: "defence-building-list",
      },
        buildings,
      )
    );
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(DefenceBuildingListComponent);
export default Factory;
