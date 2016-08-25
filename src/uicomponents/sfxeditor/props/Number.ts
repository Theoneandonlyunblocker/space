/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any, any>;
  onValueChange: () => void;

  value: number;
}

interface StateType
{
}

export class SFXFragmentPropNumberComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropNumber";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  private handleChange(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
    const value = parseFloat(target.value);

    const valueIsValid = isFinite(value);

    if (!valueIsValid)
    {
      return;
    }

    this.props.fragment.props[this.props.propName] = value;

    this.props.onValueChange();
  }
  
  render()
  {
    return(
      React.DOM.input(
      {
        className: "sfx-fragment-prop-number-input",
        type: "number",
        onChange: this.handleChange,
        step: 0.1,
        value: "" + this.props.value
      },
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropNumberComponent);
export default Factory;
