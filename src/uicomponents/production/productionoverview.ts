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
        var initialSelected: Star = null;
        var player: Player = this.props.player;

        var starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();

        if (starsByManufactoryPresence.withManufactories.length > 0)
        {
          starsByManufactoryPresence.withManufactories.sort(sortByManufactoryCapacityFN);
          initialSelected = starsByManufactoryPresence.withManufactories[0];
        }
        else if (starsByManufactoryPresence.withoutManufactories.length > 0)
        {
          starsByManufactoryPresence.withoutManufactories.sort(sortByManufactoryCapacityFN);
          initialSelected = starsByManufactoryPresence.withoutManufactories[0];
        }

        return(
        {
          selectedStar: initialSelected, // Star
          highlightedStars: [initialSelected], // Star[]
          money: player.money
        });
      },

      triggerUpdate: function()
      {
        this.forceUpdate();
      },

      updateMoney: function()
      {
        this.setState(
        {
          money: this.props.player.money
        });
      },

      componentDidMount: function()
      {
        eventManager.addEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
        eventManager.addEventListener("playerMoneyUpdated", this.updateMoney);
      },

      componentWillUnmount: function()
      {
        eventManager.removeEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
        eventManager.removeEventListener("playerMoneyUpdated", this.updateMoney);
      },

      getStarsWithAndWithoutManufactories: function()
      {
        var player: Player = this.props.player;

        var starsWithManufactories: Star[] = [];
        var starsWithoutManufactories: Star[] = [];

        for (var i = 0; i < player.controlledLocations.length; i++)
        {
          var star = player.controlledLocations[i];
          if (star.manufactory)
          {
            starsWithManufactories.push(star);
          }
          else
          {
            starsWithoutManufactories.push(star);
          }
        }

        return(
        {
          withManufactories: starsWithManufactories,
          withoutManufactories: starsWithoutManufactories
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
        var selectedStar: Star = this.state.selectedStar;

        var starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();

        var queueElement: ReactComponentPlaceHolder = null;
        if (selectedStar)
        {
          if (selectedStar.manufactory)
          {
            queueElement = UIComponents.BuildQueue(
            {
              manufactory: selectedStar.manufactory,
              triggerUpdate: this.triggerUpdate,
              money: this.state.money
            });
          }
          else
          {
            queueElement = UIComponents.ConstructManufactory(
            {
              star: selectedStar,
              player: player,
              money: this.state.money,
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
              starsWithManufactories: starsByManufactoryPresence.withManufactories,
              starsWithoutManufactories: starsByManufactoryPresence.withoutManufactories,
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
                money: this.state.money,
                triggerUpdate: this.triggerUpdate
              })
            )
          )
        );
      }
    })
  }
}
