module Rance
{
  export module UIComponents
  {
    export var FlagSetter = React.createClass(
    {
      displayName: "FlagSetter",
      getInitialState: function()
      {
        return(
        {
          emblem: null,
          active: false
        });
      },
      render: function()
      {
        return(
          React.DOM.div({className: "flag-setter"}, "flagSetter")
        );
      }
    })
  }
}
