/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufactorystarslistitem.ts" />

/// <reference path="../../star.ts" />

export interface PropTypes
{
  starsWithManufactories: Star[];
  starsWithoutManufactories: Star[];
  highlightedStars: Star[];
  handleStarSelect: reactTypeTODO_func;
}

interface StateType
{
  // TODO refactor | add state type
}

class ManufactoryStarsList extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufactoryStarsList";

  state: StateType;

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
    var starsWithManufactories: Star[] = this.props.starsWithManufactories;
    var starsWithoutManufactories: Star[] = this.props.starsWithoutManufactories;
    var highlightedStars: Star[] = this.props.highlightedStars;
    var handleStarSelect: Function = this.props.handleStarSelect;


    var rows: ReactComponentPlaceHolder[] = [];

    starsWithManufactories.sort(sortByManufactoryCapacityFN);
    starsWithoutManufactories.sort(sortByManufactoryCapacityFN);

    for (var i = 0; i < starsWithManufactories.length; i++)
    {
      var star = starsWithManufactories[i];
      var manufactory = star.manufactory;
      var isHighlighted = highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: manufactory.buildQueue.length,
        totalCapacity: manufactory.capacity,

        onClick: handleStarSelect
      }));
    }
    for (var i = 0; i < starsWithoutManufactories.length; i++)
    {
      var star = starsWithoutManufactories[i];
      var isHighlighted = highlightedStars.indexOf(star) !== -1;

      rows.push(ManufactoryStarsListItem(
      {
        key: star.id,
        star: star,
        isHighlighted: isHighlighted,
        usedCapacity: 0,
        totalCapacity: 0,

        onClick: handleStarSelect
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

const Factory: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsList);
export default Factory;
