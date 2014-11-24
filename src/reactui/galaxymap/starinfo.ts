/// <reference path="defencebuildinglist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var StarInfo = React.createClass({

      render: function()
      {
        var star: Star = this.props.selectedStar;
        if (!star) return null;

        
        return(
          React.DOM.div(
          {
            className: "star-info"
          },
            React.DOM.div(
            {
              className: "star-info-name"
            },
              star.name
            ),
            React.DOM.div(
            {
              className: "star-info-owner"
            },
              star.owner ? star.owner.name : null
            ),

            React.DOM.div(
            {
              className: "star-info-location"
            },
              "x: " + star.x.toFixed() +
              " y: " + star.y.toFixed()
            ),
            React.DOM.div(
            {
              className: "star-info-income"
            },
              "Income: " + star.getIncome()
            ),
            UIComponents.DefenceBuildingList(
            {
              buildings: star.buildings["defence"]
            })
            
          )
        );
      }
    });
  }
}
