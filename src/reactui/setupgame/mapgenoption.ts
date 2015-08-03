module Rance
{
  export module UIComponents
  {
    export var MapGenOption = React.createClass(
    {
      displayName: "MapGenOption",

      handleChange: function(e)
      {
        var option = this.props.option;
        var newValue = clamp(parseFloat(e.target.value), option.min, option.max);
        this.props.onChange(this.props.id, newValue);
      },

      shouldComponentUpdate: function(newProps: any)
      {
        return newProps.value !== this.props.value;
      },

      render: function()
      {
        var option = this.props.option;
        var id = "mapGenOption_" + this.props.id;

        ["min", "max", "step"].forEach(function(prop)
        {
          if (!option[prop])
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
              htmlFor: id
            },
              this.props.id
            ),
            React.DOM.input(
            {
              className: "map-gen-option-slider",
              id: id,
              type: "range",
              min: option.min,
              max: option.max,
              step: option.step,
              value: this.props.value,
              onChange: this.handleChange
            }),
            React.DOM.input(
            {
              className: "map-gen-option-value",
              type: "number",
              min: option.min,
              max: option.max,
              step: option.step,
              value: this.props.value,
              onChange: this.handleChange
            })
          )
        );
      }
    })
  }
}
