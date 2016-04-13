/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  onChangeFN: (e: React.FormEvent) => void;
  label: string;
  isChecked: boolean;
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
    var checkboxID = "options-checkbox-" + this.props.label;
    
    return(
      React.DOM.div(
      {
        className: "options-checkbox-container"
      },
        React.DOM.input(
        {
          type: "checkbox",
          id: checkboxID,
          checked: this.props.isChecked,
          onChange: this.props.onChangeFN
        }),
        React.DOM.label(
        {
          htmlFor: checkboxID
        },
          this.props.label
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsCheckboxComponent);
export default Factory;