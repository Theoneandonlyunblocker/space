module Rance
{
  export module UIComponents
  {
    export var OptionsCheckbox = React.createClass(
    {
      displayName: "OptionsCheckbox",
      render: function()
      {
        var key = "options-checkbox-" + this.props.label
        
        return(
          React.DOM.div(
          {
            className: "options-checkbox-container"
          },
            React.DOM.input(
            {
              type: "checkbox",
              id: key,
              checked: this.props.isChecked,
              onChange: this.props.onChangeFN
            }),
            React.DOM.label(
            {
              htmlFor: key
            },
              this.props.label
            )
          )
        );
      }
    })
  }
}
