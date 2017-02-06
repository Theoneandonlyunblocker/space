/// <reference path="../../../lib/react-global.d.ts" />

import Star from "../../Star";
import ManufactoryStarsListItem from "./ManufactoryStarsListItem";
import {sortByManufactoryCapacityFN} from "../../utility";


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
  displayName: string = "ManufactoryStarsList";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    var rows: React.ReactElement<any>[] = [];

    this.props.starsWithManufactories.sort(sortByManufactoryCapacityFN);
    this.props.starsWithoutManufactories.sort(sortByManufactoryCapacityFN);

    for (let i = 0; i < this.props.starsWithManufactories.length; i++)
    {
      var star = this.props.starsWithManufactories[i];
      var manufactory = star.manufactory;
      var isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: manufactory.buildQueue.length,
        totalCapacity: manufactory.capacity,

        onClick: this.props.handleStarSelect
      }));
    }
    for (let i = 0; i < this.props.starsWithoutManufactories.length; i++)
    {
      var star = this.props.starsWithoutManufactories[i];
      var isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: 0,
        totalCapacity: 0,

        onClick: this.props.handleStarSelect
      }));
    }

    return(
      React.DOM.div(
      {
        className: "manufactory-stars-list"
      },
        rows
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListComponent);
export default Factory;
