import * as React from "react";

import Star from "../../Star";
import {sortByManufactoryCapacityFN} from "../../utility";
import ManufactoryStarsListItem from "./ManufactoryStarsListItem";


export interface PropTypes extends React.Props<any>
{
  starsWithManufactories: Star[];
  starsWithoutManufactories: Star[];
  highlightedStars: Star[];
  handleStarSelect: (star: Star) => void;
}

interface StateType
{
}

export class ManufactoryStarsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufactoryStarsList";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const rows: React.ReactElement<any>[] = [];

    this.props.starsWithManufactories.sort(sortByManufactoryCapacityFN);
    this.props.starsWithoutManufactories.sort(sortByManufactoryCapacityFN);

    for (let i = 0; i < this.props.starsWithManufactories.length; i++)
    {
      const star = this.props.starsWithManufactories[i];
      const manufactory = star.manufactory;
      const isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: manufactory.buildQueue.length,
        totalCapacity: manufactory.capacity,

        onClick: this.props.handleStarSelect,
      }));
    }
    for (let i = 0; i < this.props.starsWithoutManufactories.length; i++)
    {
      const star = this.props.starsWithoutManufactories[i];
      const isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: 0,
        totalCapacity: 0,

        onClick: this.props.handleStarSelect,
      }));
    }

    return(
      React.DOM.div(
      {
        className: "manufactory-stars-list",
      },
        rows,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListComponent);
export default Factory;
