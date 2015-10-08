/// <reference path="manufactorystarslist.ts" />
/// <reference path="buildqueue.ts" />
/// <reference path="manufacturablethings.ts" />
/// <reference path="constructmanufactory.ts" />

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

      triggerUpdate: function()
      {
        this.forceUpdate();
      },

      componentDidMount: function()
      {
        eventManager.addEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
      },

      componentWillUnmount: function()
      {
        eventManager.removeEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
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
        var selectedStar: Star = this.state.selectedStar;

        var starsWithManufactories: Star[] = [];
        var starsWithoutManufcatories: Star[] = [];

        for (var i = 0; i < player.controlledLocations.length; i++)
        {
          var star = player.controlledLocations[i];
          if (star.manufactory)
          {
            starsWithManufactories.push(star);
          }
          else
          {
            starsWithoutManufcatories.push(star);
          }
        }

        var queueElement: ReactComponentPlaceHolder = null;
        if (selectedStar)
        {
          if (selectedStar.manufactory)
          {
            queueElement = UIComponents.BuildQueue(
            {
              manufactory: selectedStar.manufactory,
              triggerUpdate: this.triggerUpdate,
              money: player.money
            });
          }
          else
          {
            queueElement = UIComponents.ConstructManufactory(
            {
              star: selectedStar,
              player: player,
              triggerUpdate: this.triggerUpdate
            });
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
              queueElement,
              UIComponents.ManufacturableThings(
              {
                selectedStar: selectedStar,
                player: player,
                triggerUpdate: this.triggerUpdate
              })
            )
          )
        );
      }
    })
  }
}
