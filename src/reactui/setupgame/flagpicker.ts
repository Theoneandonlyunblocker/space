module Rance
{
  export module UIComponents
  {
    export var FlagPicker = React.createClass(
    {
      displayName: "FlagPicker",
      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "flag-picker"
          }, "flagPicker")
        );
      }
    })
  }
}
