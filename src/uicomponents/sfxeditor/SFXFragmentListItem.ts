import * as React from "react";

import SfxFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SfxFragment";
import DragPositioner from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import SfxFragmentConstructor from "./SfxFragmentConstructor";


type Fragment = SfxFragment<any> | SfxFragmentConstructor;

interface PropTypes<P extends Fragment> extends React.Props<any>
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

export class SfxFragmentListItemComponent<P extends Fragment> extends React.Component<PropTypes<P>, StateType>
{
  public displayName = "SfxFragmentListItem";
  public state: StateType;

  dragPositioner: DragPositioner<SfxFragmentListItemComponent<P>>;

  constructor(props: PropTypes<P>)
  {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);


    if (this.props.isDraggable)
    {
      this.dragPositioner = new DragPositioner(this,
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
    const listItemProps: React.HTMLProps<HTMLLIElement> =
    {
      className: "sfx-fragment-list-item",
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
      React.DOM.li(listItemProps,
        this.props.fragment.displayName,
      )
    );
  }
}

const factory: React.Factory<PropTypes<Fragment>> = React.createFactory(SfxFragmentListItemComponent);
export default factory;
