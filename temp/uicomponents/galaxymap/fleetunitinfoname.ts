/// <reference path="../../unit.ts" />

export interface PropTypes
{
  unit: Unit;
  isNotDetected: boolean;
}

export var FleetUnitInfoName = React.createFactory(React.createClass(
{
  displayName: "FleetUnitInfoName",


  getInitialState: function()
  {
    return(
    {
      value: this.props.unit.name
    });
  },
  onChange: function(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    this.setState({value: target.value});
    this.props.unit.name = target.value;
  },
  render: function()
  {
    return(
      React.DOM.input(
      {
        className: "fleet-unit-info-name",
        value: this.props.isNotDetected ? "Unidentified ship" : this.state.value,
        onChange: this.props.isNotDetected ? null :  this.onChange,
        readOnly: this.props.isNotDetected
      })
    );
  }
}));
