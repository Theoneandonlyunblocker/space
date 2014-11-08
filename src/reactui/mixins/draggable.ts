/// <reference path="../../../lib/react.d.ts" />

module Rance
{
  export module UIComponents
  {
    export var Draggable =
    {
      getDefaultProps: function()
      {
        return(
        {
          dragThreshhold: 5
        });
      },
      getInitialState: function()
      {
        return(
        {
          mouseDown: false,
          dragging: false,
          dragOffset:
          {
            x: 0,
            y: 0
          },
          mouseDownPosition:
          {
            x: 0,
            y: 0
          },
          originPosition:
          {
            x: 0,
            y: 0
          }

        });
      },
      handleMouseDown: function(e)
      {
        console.log(e);
        var clientRect = this.DOMNode.getBoundingClientRect();

        if (this.onDragStart)
        {
          this.onDragStart(e);
        }
        this.addEventListeners();

        this.setState(
        {
          mouseDown: true,
          mouseDownPosition:
          {
            x: e.pageX,
            y: e.pageY
          },
          originPosition:
          {
            x: clientRect.left + document.body.scrollLeft,
            y: clientRect.top + document.body.scrollTop
          },
          dragOffset:
          {
            x: e.clientX - clientRect.left,
            y: e.clientY - clientRect.top
          }
        });
      },
      handleMouseMove: function(e)
      {
        
        if (e.clientX === 0 && e.clientY === 0) return;


        if (!this.state.dragging)
        {
          var deltaX = Math.abs(e.pageX - this.state.mouseDownPosition.x);
          var deltaY = Math.abs(e.pageY - this.state.mouseDownPosition.y);

          var delta = deltaX + deltaY;

          if (delta >= this.props.dragThreshhold)
          {
            this.setState({dragging: true});
          }
        }

        if (this.state.dragging)
        {
          this.handleDrag(e);
        }
      },
      handleDrag: function(e)
      {
        var x = e.pageX - this.state.dragOffset.x + document.body.scrollLeft;
        var y = e.pageY - this.state.dragOffset.y + document.body.scrollTop;
        var domWidth = parseInt(this.DOMNode.offsetWidth);
        var domHeight = parseInt(this.DOMNode.offsetHeight);

        var containerWidth = parseInt(this.containerElement.offsetWidth);
        var containerHeight = parseInt(this.containerElement.offsetHeight);


        var x2 = x + domWidth;
        var y2 = y + domHeight;

        if (x < 0)
        {
          x = 0;
        }
        else if (x2 > containerWidth)
        {
          x = containerWidth - domWidth;
        };

        if (y < 0)
        {
          y = 0;
        }

        else if (y2 > containerHeight)
        {
          y = containerHeight - domHeight;
        };

        this.setState(
        {
          dragPos:
          {
            top: y,
            left: x
          }
        });
        //this.DOMNode.style.left = x+"px";
        //this.DOMNode.style.top = y+"px";

        if (this.onDragMove)
        {
          this.onDragMove(x, y);
        }
      },
      handleMouseUp: function(e)
      {
        this.removeEventListeners();

        this.setState(
        {
          mouseDown: false,
          mouseDownPosition:
          {
            x: 0,
            y: 0
          }
        });

        if (this.state.dragging)
        {
          this.handleDragEnd(e);
        }
      },
      handleDragEnd: function(e)
      {
        if (this.onDragEnd)
        {
          var clientRect = this.DOMNode.getBoundingClientRect();

          var endSuccesful = this.onDragEnd(clientRect);

          if (!endSuccesful)
          {
            this.DOMNode.style.left = this.state.originPosition.x+"px";
            this.DOMNode.style.top = this.state.originPosition.y+"px";
          }
          else
          {
            this.DOMNode.style.left = this.props.position.left;
            this.DOMNode.style.top = this.props.position.top;
          }
        }
        this.setState(
        {
          dragging: false,
          dragOffset:
          {
            x: 0,
            y: 0
          },
          originPosition:
          {
            x: 0,
            y: 0
          }
        });
      },
      addEventListeners: function()
      {
        var self = this;
        this.containerElement.addEventListener("mousemove", self.handleMouseMove);
        document.addEventListener("mouseup", self.handleMouseUp);
      },
      removeEventListeners: function()
      {
        var self = this;
        this.containerElement.removeEventListener("mousemove", self.handleMouseMove);
        document.removeEventListener("mouseup", self.handleMouseUp);
      },
      componentDidMount: function() {
        this.DOMNode = this.getDOMNode();
        this.containerElement = this.props.containerElement || document.body;
      }
    }
  }
}
