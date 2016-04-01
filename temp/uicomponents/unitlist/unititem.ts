/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitItem extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitItem";
  mixins: reactTypeTODO_any = [Draggable];

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  onDragStart()
  {
    this.props.onDragStart(this.props.item);
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  onDragEnd()
  {
    this.props.onDragEnd();
  }
  getTechIcon(techLevel: number)
  {
    switch (techLevel)
    {
      case 2:
      {
        return "img\/icons\/t2icon.png"
      }
      case 3:
      {
        return "img\/icons\/t3icon.png"
      }
    }
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    if (!this.props.item)
    {
      var emptyItemTitle = "Item slot: " + this.props.slot;
      return(
        React.DOM.div({className: "empty-unit-item", title: emptyItemTitle})
      );

    }
    var item = this.props.item;

    var divProps: any =
    {
      className: "unit-item",
      title: item.template.displayName
    };
    
    if (this.props.isDraggable)
    {
      divProps.className += " draggable";
      divProps.onMouseDown = divProps.onTouchStart =
        this.handleMouseDown;
    }

    if (this.state.dragging)
    {
      divProps.style = this.dragPos;
      divProps.className += " dragging";
    }

    return(
      React.DOM.div(divProps,
        React.DOM.div(
        {
          className: "item-icon-container"
        },
          React.DOM.img(
          {
            className: "item-icon-base",
            src: item.template.icon
          }),
          item.template.techLevel > 1 ? React.DOM.img(
          {
            className: "item-icon-tech-level",
            src: this.getTechIcon(item.template.techLevel)
          }) : null
        )
      )
    );
  }
}
