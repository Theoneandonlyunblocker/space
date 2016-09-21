/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface PropTypes extends React.Props<any>
{
  propName: string;
  label: string;

  value: number;
  onValueChange: (newValue: number) => void;
}

interface StateType
{
}

export class InlineNumberPropComponent extends React.Component<PropTypes, StateType>
{
  displayName = "InlineNumberProp";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  private handleValueChange(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
    this.props.onValueChange(parseFloat(target.value));
  }
  
  render()
  {
    const baseID = "sfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;

    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-inline-number-wrapper"
      },
        React.DOM.label(
        {
          className: "sfx-fragment-prop-inline-number-label",
          htmlFor: baseID
        },
          this.props.label + ":",
        ),
        React.DOM.input(
        {
          className: "sfx-fragment-prop-inline-number-input",
          id: baseID,
          type: "number",
          onChange: this.handleValueChange,
          step: 0.1,
          value: "" + this.props.value
        },
          
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(InlineNumberPropComponent);
export default Factory;
