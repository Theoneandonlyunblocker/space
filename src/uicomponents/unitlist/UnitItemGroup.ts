/// <reference path="../../../lib/react-global.d.ts" />

import Item from "../../Item";
import UnitItemWrapper from "./UnitItemWrapper";

interface PropTypes extends React.Props<any>
{
  slotName: string;
  items: Item[];

  isDraggable?: boolean;
  onDragEnd?: (dropSuccesful?: boolean) => void;
  onDragStart?: (item: Item) => void;
  onMouseUp?: () => void;
  currentDragItem?: Item;
}

interface StateType
{
}

export class UnitItemGroupComponent extends React.Component<PropTypes, StateType>
{
  displayName = "UnitItemGroup";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "unit-item-group unit-item-group-" + this.props.slotName
      },
        this.props.items.map((item, i) =>
        {
          return UnitItemWrapper(
          {
            key: i,
            slot: this.props.slotName,
            item: item,

            onMouseUp: this.props.onMouseUp,
            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            currentDragItem: this.props.currentDragItem
          })
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitItemGroupComponent);
export default Factory;
