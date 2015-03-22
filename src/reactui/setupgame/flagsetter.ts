module Rance
{
  export module UIComponents
  {
    export var FlagSetter = React.createClass(
    {
      displayName: "FlagSetter",
      render: function()
      {
        return(
          React.DOM.div({className: "flag-setter"}, "flagSetter")
        );
      }
    })
  }
}
