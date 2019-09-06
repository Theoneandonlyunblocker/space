import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment";

import {VfxFragmentPropsList} from "./VfxFragmentPropsList";


export interface PropTypes extends React.Props<any>
{
  fragment: VfxFragment<any>;
  onActiveFragmentPropValueChange: () => void;
}

interface StateType
{
}

export class VfxFragmentEditorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentEditor";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleReset = this.handleReset.bind(this);
  }

  private handleReset(): void
  {
    this.props.fragment.setDefaultProps();
    this.props.onActiveFragmentPropValueChange();
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "vfx-fragment-editor",
      },
        ReactDOMElements.button(
        {
          className: "vfx-fragment-reset-props-button",
          onClick: this.handleReset,
        },
          "Reset",
        ),
        VfxFragmentPropsList(
        {
          fragment: this.props.fragment,
          onPropValueChange: this.props.onActiveFragmentPropValueChange,
        }),
      )
    );
  }
}

export const VfxFragmentEditor: React.Factory<PropTypes> = React.createFactory(VfxFragmentEditorComponent);
