/// <reference path="../../eventmanager.ts"/>
/// <reference path="../../star.ts"/>

/// <reference path="fleetinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var StarInfo = React.createClass({
    
      getInitialState: function()
      {
        return(
        {
          currentStar: null
        });
      },
      componentWillMount: function()
      {
        var self = this;
        eventManager.addEventListener("starClick", function(event)
        {
          self.setStar(event.data.star);
        });
      },
      setStar: function(star: Star)
      {
        this.setState(
        {
          currentStar: star
        });
      },
      render: function()
      {
        var star = this.state.currentStar;

        var toRender = [];

        if (star)
        {
          toRender.push(
            React.DOM.div(
              {
                key: "id"  
              },
              React.DOM.span(null, "id: " + star.id),
              React.DOM.span(null, "pos: " + star.x.toFixed() + ", " + star.y.toFixed())
            )
          );
        }

        return(
          React.DOM.div(
          {
            className: "star-info"
          },
            toRender
          )
        );
      }
    });
  }
}
