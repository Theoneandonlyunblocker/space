/// <reference path="../mixins/droptarget.ts"/>

/// <reference path="unititem.ts"/>

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitItemWrapper extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitItemWrapper";
  mixins: reactTypeTODO_any = [DropTarget];

  handleMouseUp: function()
  {
    this.props.onMouseUp(this.props.slot);
  }

  render: function()
  {
    var item = this.props.item;

    var wrapperProps: any =
    {
      className: "unit-item-wrapper"
    };

    // if this is declared inside the conditional block
    // the component won't accept the first drop properly
    if (this.props.onMouseUp)
    {
      wrapperProps.onMouseUp = this.handleMouseUp
    };

    if (this.props.currentDragItem)
    {
      var dragItem = this.props.currentDragItem;
      if (dragItem.template.slot === this.props.slot)
      {
        wrapperProps.className += " drop-target";
      }
      else
      {
        wrapperProps.onMouseUp = null;
        wrapperProps.className += " invalid-drop-target";
      }
    }
    
    return(
      React.DOM.div(wrapperProps,
        UIComponents.UnitItem(
        {
          item: this.props.item,
          slot: this.props.slot,
          key: "item",

          isDraggable: this.props.isDraggable,
          onDragStart: this.props.onDragStart,
          onDragEnd: this.props.onDragEnd
        })
      )
    );
  }
}
