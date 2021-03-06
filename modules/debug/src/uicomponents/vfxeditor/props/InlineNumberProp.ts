import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {NumberInput} from "modules/defaultui/src/uicomponents/generic/NumberInput";


export interface PropTypes extends React.Props<any>
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
  public displayName = "InlineNumberProp";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const baseId = "vfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;

    return(
      ReactDOMElements.div(
      {
        className: "vfx-fragment-prop-inline-number-wrapper",
      },
        ReactDOMElements.label(
        {
          className: "vfx-fragment-prop-inline-number-label",
          htmlFor: baseId,
        },
          `${this.props.label}:`,
        ),
        NumberInput(
        {
          value: this.props.value,
          noSpinner: true,
          onChange: this.props.onValueChange,
        }),
      )
    );
  }
}

export const InlineNumberProp: React.Factory<PropTypes> = React.createFactory(InlineNumberPropComponent);
