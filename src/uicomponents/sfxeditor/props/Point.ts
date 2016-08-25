/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any, any>;
  onValueChange: () => void;

  x: number;
  y: number;
}

interface StateType
{
}

export class SFXFragmentPropPointComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropPoint";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleXChange = this.handleValueChange.bind(this, "x");
    this.handleYChange = this.handleValueChange.bind(this, "y");
  }

  private handleXChange: (e: React.FormEvent) => void;
  private handleYChange: (e: React.FormEvent) => void;
  private handleValueChange(key: "x" | "y", e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
    const value = parseFloat(target.value);

    this.props.fragment.props[this.props.propName][key] = value;

    this.props.onValueChange();
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-point-wrapper"
      },
        React.DOM.label(
        {
          className: "sfx-fragment-prop-point-label"
        },
          "X:",
          React.DOM.input(
          {
            className: "sfx-fragment-prop-point-input",
            type: "number",
            onChange: this.handleXChange,
            value: this.props.fragment.props[this.props.propName].x
          },
            
          )
        ),
        React.DOM.label(
        {
          className: "sfx-fragment-prop-point-label"
        },
          "Y:",
          React.DOM.input(
          {
            className: "sfx-fragment-prop-point-input",
            type: "number",
            onChange: this.handleYChange,
            value: this.props.fragment.props[this.props.propName].y
          },
            
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropPointComponent);
export default Factory;
