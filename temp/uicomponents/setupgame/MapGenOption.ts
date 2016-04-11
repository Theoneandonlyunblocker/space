/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  value: any; // TODO refactor | define prop type 123
  id: any; // TODO refactor | define prop type 123
  option: any; // TODO refactor | define prop type 123
  onChange: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class MapGenOption_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapGenOption";

  handleChange(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var option = this.props.option;
    var newValue = clamp(parseFloat(target.value), option.min, option.max);
    this.props.onChange(this.props.id, newValue);
  }

  shouldComponentUpdate(newProps: any)
  {
    return newProps.value !== this.props.value;
  }

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var option: MapGenOption = this.props.option;
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapGenOption_COMPONENT_TODO);
export default Factory;
