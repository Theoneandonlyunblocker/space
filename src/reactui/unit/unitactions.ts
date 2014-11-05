/// <reference path="unitstrength.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitActions = React.createClass(
    {
      render: function()
      {
        var availableSrc = "img\/icons\/availableAction.png";
        var spentSrc = "img\/icons\/spentAction.png";

        var icons = [];
        var availableCount = this.props.maxActionPoints - this.props.currentActionPoints;



        for (var i = 0; i < availableCount; i++)
        {
          icons.push(React.DOM.img(
            {
              src: availableSrc,
              key: "available" + i
            }
          ));
        }
        for (var i = 0; i < this.props.maxActionPoints - availableCount; i++)
        {
          icons.push(React.DOM.img(
            {
              src: spentSrc,
              key: "spent" + i
            }
          ));
        }

        return(
          React.DOM.div({className: "unit-action-points"},
            icons
          )
        );
      }
    });
  }
}