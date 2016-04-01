export interface PropTypes
{
  // TODO refactor | add prop types
}

export var MapGenOption = React.createFactory(React.createClass(
{
  displayName: "MapGenOption",

  handleChange: function(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var option = this.props.option;
    var newValue = clamp(parseFloat(target.value), option.min, option.max);
    this.props.onChange(this.props.id, newValue);
  },

  shouldComponentUpdate: function(newProps: any)
  {
    return newProps.value !== this.props.value;
  },

  render: function()
  {
    var option: Templates.IMapGenOption = this.props.option;
    var range = option.range;
    var id = "mapGenOption_" + this.props.id;

    ["min", "max", "step"].forEach(function(prop: string)
    {
      if (!range[prop])
      {
        throw new Error("No property " + prop +" specified on map gen option " + this.props.id);
      }
    }.bind(this));

    // console.log(this.props.id, this.props.value);

    return(
      React.DOM.div(
      {
        className: "map-gen-option"
      },
        React.DOM.label(
        {
          className: "map-gen-option-label",
          title: option.displayName,
          htmlFor: id
        },
          option.displayName
        ),
        React.DOM.input(
        {
          className: "map-gen-option-slider",
          id: id,
          type: "range",
          min: range.min,
          max: range.max,
          step: range.step,
          value: this.props.value,
          onChange: this.handleChange
        }),
        React.DOM.input(
        {
          className: "map-gen-option-value",
          title: option.displayName,
          type: "number",
          min: range.min,
          max: range.max,
          step: range.step,
          value: this.props.value,
          onChange: this.handleChange
        })
      )
    );
  }
}));
