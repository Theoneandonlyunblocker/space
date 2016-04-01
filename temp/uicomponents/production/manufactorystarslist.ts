/// <reference path="manufactorystarslistitem.ts" />

/// <reference path="../../star.ts" />

export interface PropTypes
{
  starsWithManufactories: Star[];
  starsWithoutManufactories: Star[];
  highlightedStars: Star[];
  handleStarSelect: reactTypeTODO_func;
}

export var ManufactoryStarsList = React.createFactory(React.createClass(
{
  displayName: "ManufactoryStarsList",

  propTypes:
  {
    starsWithManufactories: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
    starsWithoutManufactories: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
    highlightedStars: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
    handleStarSelect: React.PropTypes.func.isRequired
  },
  render: function()
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

      rows.push(UIComponents.ManufactoryStarsListItem(
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

      rows.push(UIComponents.ManufactoryStarsListItem(
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
}));
