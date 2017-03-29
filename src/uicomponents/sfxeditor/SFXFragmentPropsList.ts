/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentProp from "./props/SFXFragmentProp";

interface PropTypes extends React.Props<any>
{
  fragment: SFXFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
}

export class SFXFragmentPropsListComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropsList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const fragment = this.props.fragment;

    return(
      React.DOM.ul(
      {
        className: "sfx-fragment-props-list",
      },
        Object.keys(fragment.props).sort().map(propName =>
        {
          const propType = fragment.propInfo[propName].type;

          return SFXFragmentProp(
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

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropsListComponent);
export default Factory;
