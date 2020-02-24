import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";

import {VfxFragmentProp} from "./props/VfxFragmentProp";


export interface PropTypes extends React.Props<any>
{
  fragment: VfxFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
}

export class VfxFragmentPropsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentPropsList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const fragment = this.props.fragment;

    return(
      ReactDOMElements.ul(
      {
        className: "vfx-fragment-props-list",
      },
        Object.keys(fragment.props).sort().map(propName =>
        {
          const propType = fragment.propInfo[propName].type;

          return VfxFragmentProp(
          {
            key: propName,
            propName: propName,
            propType: propType,
            fragment: fragment,
            onPropValueChange: this.props.onPropValueChange,
          });
        }),
      )
    );
  }
}

export const VfxFragmentPropsList: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropsListComponent);
