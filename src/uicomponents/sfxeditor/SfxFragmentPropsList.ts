import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SfxFragment";

import SfxFragmentProp from "./props/SfxFragmentProp";


interface PropTypes extends React.Props<any>
{
  fragment: SfxFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
}

export class SfxFragmentPropsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentPropsList";
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
        className: "sfx-fragment-props-list",
      },
        Object.keys(fragment.props).sort().map(propName =>
        {
          const propType = fragment.propInfo[propName].type;

          return SfxFragmentProp(
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropsListComponent);
export default factory;
