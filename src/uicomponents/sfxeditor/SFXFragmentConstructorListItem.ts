/// <reference path="../../../lib/react-global.d.ts" />

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import SFXFragmentConstructor from "./SFXFragmentConstructor";

interface PropTypes extends React.Props<any>
{
  fragmentConstructor: SFXFragmentConstructor;

  isDraggable: boolean;
  onDragStart?: (fragmentConstructor: SFXFragmentConstructor) => void;
  onDragEnd?: () => void;
  
  onClick?: (fragmentConstructor: SFXFragmentConstructor) => void;
}

interface StateType
{
}

export class SFXFragmentConstructorListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentConstructorListItem";
  state: StateType;

  dragPositioner: DragPositioner<SFXFragmentConstructorListItemComponent>;
  
  constructor(props: PropTypes)
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
    this.props.onDragStart(this.props.fragmentConstructor);
  }
  private onDragEnd(): void
  {
    this.props.onDragEnd();
  }
  private handleClick(): void
  {
    this.props.onClick(this.props.fragmentConstructor);
  }
  
  render()
  {
    const listItemProps: React.HTMLProps<HTMLLIElement> =
    {
      className: "sfx-fragment-list-item"
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
        this.props.fragmentConstructor.displayName
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentConstructorListItemComponent);
export default Factory;
