/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface BaseProps extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any, any>;
  onValueChange: () => void;
}

interface StateType
{
}

export abstract class Vec2Base<PropTypes extends BaseProps> extends React.Component<PropTypes, StateType>
{
  public abstract displayName: string;
  public state: StateType;

  protected abstract value1Key: string;
  protected abstract value2Key: string;

  protected abstract value1Label: string;
  protected abstract value2Label: string;
  
  constructor(props: PropTypes)
  {
    super(props);
  }

  componentWillMount(): void
  {
    this.handleValue1Change = this.handleValueChange.bind(this, this.value1Key);
    this.handleValue2Change = this.handleValueChange.bind(this, this.value2Key);
  }

  shouldComponentUpdate(newProps: PropTypes): boolean
  {
    return [this.value1Key, this.value2Key].some(key =>
    {
      return this.props[key] !== newProps[key];
    });
  }

  private handleValue1Change: (e: React.FormEvent) => void;
  private handleValue2Change: (e: React.FormEvent) => void;
  private handleValueChange(key: string, e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
    const value = parseFloat(target.value);

    const valueIsValid = isFinite(value);

    if (!valueIsValid)
    {
      return;
    }

    this.props.fragment.props[this.props.propName][key] = value;

    this.props.onValueChange();
  }
  private getValue1(): number
  {
    return this.props[this.value1Key];
  }
  private getValue2(): number
  {
    return this.props[this.value2Key];
  }
  
  render()
  {
    const baseID = "sfx-fragment-prop-vec2-value-" + this.props.propName;
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-vec2-wrapper"
      },
        React.DOM.div(
        {
          className: "sfx-fragment-prop-vec2-value-wrapper"
        },
          React.DOM.label(
          {
            className: "sfx-fragment-prop-vec2-label",
            htmlFor: baseID + "value1"
          },
            this.value1Label + ":",
          ),
          React.DOM.input(
          {
            className: "sfx-fragment-prop-vec2-input",
            id: baseID + "value1",
            type: "number",
            onChange: this.handleValue1Change,
            step: 0.1,
            value: "" + this.getValue1()
          },
            
          )
        ),
        React.DOM.div(
        {
          className: "sfx-fragment-prop-vec2-value-wrapper"
        },
          React.DOM.label(
          {
            className: "sfx-fragment-prop-vec2-label",
            htmlFor: baseID + "value2"
          },
            this.value2Label + ":",
          ),
          React.DOM.input(
          {
            className: "sfx-fragment-prop-vec2-input",
            id: baseID + "value2",
            type: "number",
            onChange: this.handleValue2Change,
            step: 0.1,
            value: "" + this.getValue2()
          },
            
          )
        )
      )
    );
  }
}

export default Vec2Base;
