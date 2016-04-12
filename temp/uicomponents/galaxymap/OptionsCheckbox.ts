/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  onChangeFN: any; // TODO refactor | define prop type 123
  label: any; // TODO refactor | define prop type 123
  isChecked: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class OptionsCheckboxComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "OptionsCheckbox";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsCheckboxComponent);
export default Factory;
