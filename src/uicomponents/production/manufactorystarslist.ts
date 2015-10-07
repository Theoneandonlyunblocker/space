/// <reference path="manufactorystarslistitem.ts" />

/// <reference path="../../star.ts" />

module Rance
{
  export module UIComponents
  {
    export var ManufactoryStarsList = React.createClass(
    {
      displayName: "ManufactoryStarsList",

      propTypes:
      {
        starsWithManufactories: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
        starsWithoutManufcatories: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
        highlightedStars: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Star)).isRequired,
        handleStarSelect: React.PropTypes.func.isRequired
      },

      sortByStarNameFN: function(a: Star, b: Star)
      {
        var aLevel = (a.manufactory ? a.manufactory.capacity : -1);
        var bLevel = (b.manufactory ? b.manufactory.capacity : -1);

        if (bLevel !== aLevel)
        {
          return bLevel - aLevel;
        }

        var _a: string = a.name.toLowerCase();
        var _b: string = b.name.toLowerCase();
        
        if (_a > _b) return 1;
        else if (_a < _b) return -1;
        else return 0;
      },

      render: function()
      {
        var starsWithManufactories: Star[] = this.props.starsWithManufactories;
        var starsWithoutManufcatories: Star[] = this.props.starsWithoutManufcatories;
        var highlightedStars: Star[] = this.props.highlightedStars;
        var handleStarSelect: Function = this.props.handleStarSelect;


        var rows: ReactComponentPlaceHolder[] = [];

        starsWithManufactories.sort(this.sortByStarNameFN);
        starsWithoutManufcatories.sort(this.sortByStarNameFN);

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
        for (var i = 0; i < starsWithoutManufcatories.length; i++)
        {
          var star = starsWithoutManufcatories[i];
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
    })
  }
}
