module Rance
{
  export module UIComponents
  {
    export var ShipInfoName = React.createClass(
    {
      displayName: "ShipInfoName",

      getInitialState: function()
      {
        return(
        {
          value: this.props.unit.name
        });
      },
      onChange: function(e)
      {
        this.setState({value: e.target.value});
        this.props.unit.name = e.target.value;
      },
      render: function()
      {
        return(
          React.DOM.input(
          {
            className: "ship-info-name",
            value: this.state.value,
            onChange: this.onChange
          })
        );
      }
    });
  }
}
