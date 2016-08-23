/// <reference path="../../../lib/react-global.d.ts" />

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import SFXFragmentConstructor from "./SFXFragmentConstructor";

interface PropTypes extends React.Props<any>
{
  fragment: SFXFragmentConstructor;

  onDragStart: (fragmentConstructor: SFXFragmentConstructor) => void;
  onDragEnd: () => void;
}

interface StateType
{
}

export class SFXFragmentListLitemComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentListLitem";
  state: StateType;

  dragPositioner: DragPositioner<SFXFragmentListLitemComponent>;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.onDragStart = this.onDragStart.bind(this); 
    this.onDragEnd = this.onDragEnd.bind(this); 


    this.dragPositioner = new DragPositioner(this,
    {
      
    });
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragEnd = this.onDragEnd;

    applyMixins(this, this.dragPositioner);

  }

  private onDragStart(): void
  {
    this.props.onDragStart(this.props.fragment);
  }
  private onDragEnd(): void
  {
    this.props.onDragEnd();
  }
  
  render()
  {
    return(
      React.DOM.li(
      {
        className: "sfx-fragment-list-item" +
          " draggable",
        onTouchStart: this.dragPositioner.handleReactDownEvent,
        onMouseDown: this.dragPositioner.handleReactDownEvent
      },
        this.props.fragment.displayName
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentListLitemComponent);
export default Factory;
