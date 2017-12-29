import * as React from "react";

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import SFXFragmentConstructor from "./SFXFragmentConstructor";

import SFXFragmentListItem from "./SFXFragmentListItem";

type Fragment = SFXFragment<any> | SFXFragmentConstructor;

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

export class SFXFragmentListComponent<P extends Fragment> extends React.Component<PropTypes<P>, StateType>
{
  public displayName = "SFXFragmentList";
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
          return SFXFragmentListItem(
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

const Factory: React.Factory<PropTypes<Fragment>> = React.createFactory(SFXFragmentListComponent);
export default Factory;
