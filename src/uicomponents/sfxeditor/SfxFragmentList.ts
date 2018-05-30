import * as React from "react";

import SfxFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SfxFragment";

import SfxFragmentConstructor from "./SfxFragmentConstructor";

import SfxFragmentListItem from "./SfxFragmentListItem";


type Fragment = SfxFragment<any> | SfxFragmentConstructor;

interface PropTypes<P extends Fragment> extends React.Props<any>
{
  fragments: P[];

  isDraggable: boolean;
  onDragStart?: (fragment: P) => void;
  onDragEnd?: () => void;

  onClick?: (fragment: P) => void;
}

interface StateType
{
}

export class SfxFragmentListComponent<P extends Fragment> extends React.Component<PropTypes<P>, StateType>
{
  public displayName = "SfxFragmentList";
  public state: StateType;

  constructor(props: PropTypes<P>)
  {
    super(props);
  }

  render()
  {
    return(
      React.DOM.ol(
      {
        className: "sfx-fragment-list",
      },
        this.props.fragments.map(fragment =>
        {
          return SfxFragmentListItem(
          // @ts-ignore 2345
          {
            key: fragment.key,
            fragment: fragment,
            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            onClick: this.props.onClick,
          });
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes<Fragment>> = React.createFactory(SfxFragmentListComponent);
export default factory;
