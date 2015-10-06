/// <reference path="manufactorystarslist.ts" />
/// <reference path="buildqueue.ts" />
/// <reference path="manufacturablethings.ts" />

/// <reference path="../../player.ts" />
/// <reference path="../../star.ts" />

module Rance
{
  export module UIComponents
  {
    export var ProductionOverview = React.createClass(
    {
      displayName: "ProductionOverview",

      propTypes:
      {
        player: React.PropTypes.instanceOf(Player).isRequired
      },

      getInitialState: function()
      {
        return(
        {
          selectedStar: undefined, // Star
          highlightedStars: [] // Star[]
        });
      },
      
      handleStarSelect: function(star: Star)
      {
        if (this.state.selectedStar === star)
        {
          this.clearSelection();
        }
        else
        {
          this.setState(
          {
            selectedStar: star,
            highlightedStars: [star]
          });
        }
      },

      clearSelection: function()
      {
        this.setState(
        {
          selectedStar: undefined,
          highlightedStars: []
        });
      },

      render: function()
      {
        var player: Player = this.props.player;

        var starsWithManufactories: Star[] = [];
        var starsWithoutManufcatories: Star[] = [];

        for (var i = 0; i < player.controlledLocations.length; i++)
        {
          var star = player.controlledLocations[i];
          var hasManufactory = star.id % 2 === 0;// TODO
          if (hasManufactory)
          {
            starsWithManufactories.push(star);
          }
          else
          {
            starsWithoutManufcatories.push(star);
          }
        }

        return(
          React.DOM.div(
          {
            className: "production-overview"
          },
            UIComponents.ManufactoryStarsList(
            {
              starsWithManufactories: starsWithManufactories,
              starsWithoutManufcatories: starsWithoutManufcatories,
              highlightedStars: this.state.highlightedStars,
              handleStarSelect: this.handleStarSelect
            }),
            React.DOM.div(
            {
              className: "production-overview-contents"
            },
              !this.state.selectedStar ? null : UIComponents.BuildQueue(),
              UIComponents.ManufacturableThings(
              {
                selectedStar: this.state.selectedStar,
                player: player
              })
            )
          )
        );
      }
    })
  }
}
