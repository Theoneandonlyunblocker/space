module Rance
{
  export module UIComponents
  {
    export var UnitStatusEffects = React.createClass(
    {
      displayName: "UnitStatusEffects",

      render: function()
      {
        var statusEffects = [];

        var withItems = this.props.unit.getAttributesWithItems();
        var withEffects = this.props.unit.getAttributesWithEffects();

        for (var attribute in withEffects)
        {
          if (attribute === "maxActionPoints") continue;

          var ite = withItems[attribute];
          var eff = withEffects[attribute];

          if (ite === eff) continue;

          var polarityString = eff > ite ? "positive" : "negative";
          var polaritySign = eff > ite ? " +" : " ";

          var imageSrc = "img\/icons\/statusEffect_" + polarityString + "_" + attribute + ".png";

          var titleString = "" + attribute + polaritySign + (eff - ite);

          statusEffects.push(React.DOM.img(
          {
            className: "status-effect-icon",
            src: imageSrc,
            key: attribute,
            title: titleString
          }))
        }

        return(
          React.DOM.div(
          {
            className: "unit-status-effects-container"
          },
            statusEffects
          )
        );
      }
    })
  }
}
