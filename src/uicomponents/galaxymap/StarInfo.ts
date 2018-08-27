import * as React from "react";

import {localize} from "../../../localization/localize";
import Star from "../../Star";

import TerritoryBuildingList from "./TerritoryBuildingList";
import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  selectedStar: Star;
}

interface StateType
{
}

export class StarInfoComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "StarInfo";
  shouldComponentUpdate(newProps: PropTypes)
  {
    return this.props.selectedStar !== newProps.selectedStar;
  }
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handlePlayerBuiltBuilding = this.handlePlayerBuiltBuilding.bind(this);
  }

  public componentDidMount(): void
  {
    eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }
  public componentWillUnmount(): void
  {
    eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
  }
  public render()
  {
    const star = this.props.selectedStar;
    if (!star) { return null; }

    return(
      React.DOM.div(
      {
        className: "star-info",
      },
        React.DOM.div(
        {
          className: "star-info-name",
        },
          star.name,
        ),
        React.DOM.div(
        {
          className: "star-info-owner",
        },
          star.owner ? star.owner.name.fullName : null,
        ),
        React.DOM.div(
        {
          className: "star-info-location",
        },
          `x:${star.x.toFixed()} y:${star.y.toFixed()}`,
        ),
        React.DOM.div(
        {
          className: "star-info-terrain",
        },
          `Terrain: ${star.terrain.displayName}`,
        ),
        React.DOM.div(
        {
          className: "star-info-income",
        },
          `${localize("income")()}: ${star.getIncome()}`,
        ),
        TerritoryBuildingList(
        {
          buildings: star.territoryBuildings,
        }),

      )
    );
  }

  private handlePlayerBuiltBuilding(): void
  {
    this.forceUpdate();
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(StarInfoComponent);
export default factory;
