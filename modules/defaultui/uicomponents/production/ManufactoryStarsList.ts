import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Star from "../../../../src/Star";

import ManufactoryStarsListItem from "./ManufactoryStarsListItem";


export function sortByManufactoryCapacityFN(a: Star, b: Star)
{
  const aCapacity = (a.manufactory ? a.manufactory.capacity : -1);
  const bCapacity = (b.manufactory ? b.manufactory.capacity : -1);

  const capacitySort = bCapacity - aCapacity;
  if (capacitySort)
  {
    return capacitySort;
  }

  const nameSort = a.name.localeCompare(b.name);
  if (nameSort)
  {
    return nameSort;
  }

  const idSort = a.id - b.id;

  return idSort;
}

export interface PropTypes extends React.Props<any>
{
  starsWithManufactories: Star[];
  starsWithoutManufactories: Star[];
  highlightedStars: Star[];
  setSelectedStar: (star: Star) => void;
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

        onClick: this.props.setSelectedStar,
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

        onClick: this.props.setSelectedStar,
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "manufactory-stars-list",
      },
        rows,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListComponent);
export default factory;
