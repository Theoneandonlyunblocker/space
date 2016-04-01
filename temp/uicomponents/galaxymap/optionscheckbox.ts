/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class OptionsCheckbox extends React.Component<PropTypes, {}>
{
  displayName: string = "OptionsCheckbox";
  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
