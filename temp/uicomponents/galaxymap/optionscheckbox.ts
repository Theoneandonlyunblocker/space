export var OptionsCheckbox = React.createFactory(React.createClass(
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
}));
