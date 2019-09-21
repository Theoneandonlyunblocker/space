import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/space/src/battlevfx/drawingfunctions/vfxfragments/VfxFragment";

import {VfxFragmentConstructor} from "./VfxFragmentConstructor";

import {VfxFragmentListItem} from "./VfxFragmentListItem";


type Fragment = VfxFragment<any> | VfxFragmentConstructor;

export interface PropTypes<P extends Fragment> extends React.Props<any>
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

export class VfxFragmentListComponent<P extends Fragment> extends React.Component<PropTypes<P>, StateType>
{
  public displayName = "VfxFragmentList";
  public state: StateType;

  constructor(props: PropTypes<P>)
  {
    super(props);
  }

  render()
  {
    return(
      ReactDOMElements.ol(
      {
        className: "vfx-fragment-list",
      },
        this.props.fragments.map(fragment =>
        {
          return VfxFragmentListItem(
          {
            key: fragment.key,
            fragment: fragment,
            isDraggable: this.props.isDraggable,
            // @ts-ignore 2322
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            // @ts-ignore 2322
            onClick: this.props.onClick,
          });
        }),
      )
    );
  }
}

export const VfxFragmentList: React.Factory<PropTypes<Fragment>> = React.createFactory(VfxFragmentListComponent);
