import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/baselib/src/combat/vfx/fragments/VfxFragment";
import {DragPositioner} from "modules/defaultui/src/uicomponents/mixins/DragPositioner";
import {applyMixins} from "modules/defaultui/src/uicomponents/mixins/applyMixins";

import {VfxFragmentConstructor} from "./VfxFragmentConstructor";


type Fragment = VfxFragment<any> | VfxFragmentConstructor;

export interface PropTypes<P extends Fragment> extends React.Props<any>
{
  fragment: P;

  isDraggable: boolean;
  onDragStart?: (fragment: P) => void;
  onDragEnd?: () => void;

  onClick?: (fragment: P) => void;
}

interface StateType
{
}

export class VfxFragmentListItemComponent<P extends Fragment> extends React.Component<PropTypes<P>, StateType>
{
  public displayName = "VfxFragmentListItem";
  public state: StateType;

  dragPositioner: DragPositioner<VfxFragmentListItemComponent<P>>;
  private readonly ownDOMNode = React.createRef<HTMLLIElement>();

  constructor(props: PropTypes<P>)
  {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);


    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this, this.ownDOMNode,
      {

      });
      this.dragPositioner.onDragStart = this.onDragStart;
      this.dragPositioner.onDragEnd = this.onDragEnd;

      applyMixins(this, this.dragPositioner);
    }
  }

  private onDragStart(): void
  {
    this.props.onDragStart!(this.props.fragment);
  }
  private onDragEnd(): void
  {
    this.props.onDragEnd!();
  }
  private handleClick(): void
  {
    this.props.onClick!(this.props.fragment);
  }

  render()
  {
    const listItemProps: React.HTMLProps<HTMLLIElement> & React.ClassAttributes<HTMLLIElement> =
    {
      className: "vfx-fragment-list-item",
      ref: this.ownDOMNode,
    };

    if (this.props.isDraggable)
    {
      listItemProps.className += " draggable";
      listItemProps.onTouchStart = listItemProps.onMouseDown =
        this.dragPositioner.handleReactDownEvent;
    }
    if (this.props.onClick)
    {
      listItemProps.className += " clickable";
      listItemProps.onClick = this.handleClick;
    }

    return(
      ReactDOMElements.li(listItemProps,
        this.props.fragment.displayName,
      )
    );
  }
}

export const VfxFragmentListItem: React.Factory<PropTypes<Fragment>> = React.createFactory(VfxFragmentListItemComponent);
