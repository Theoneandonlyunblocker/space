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
          },
          clone: null

        });
      },
      handleMouseDown: function(e)
      {
        var clientRect = this.getDOMNode().getBoundingClientRect();

        this.addEventListeners();

        var dragOffset = this.props.forcedDragOffset ||
        {
          x: e.clientX - clientRect.left,
          y: e.clientY - clientRect.top
        };

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
          dragOffset: dragOffset
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
            var ownNode = this.getDOMNode();

            var stateObj: any =
            {
              dragging: true,
              dragPos:
              {
                width: parseInt(ownNode.offsetWidth),
                height: parseInt(ownNode.offsetHeight)
              }
            }

            if (this.props.makeClone)
            {
              var nextSibling = ownNode.nextSibling;
              var clone = ownNode.cloneNode(true);
              recursiveRemoveAttribute(clone, "data-reactid");

              ownNode.parentNode.insertBefore(clone, nextSibling);
              stateObj.clone = clone;
            }

            this.setState(stateObj);

            if (this.onDragStart)
            {
              this.onDragStart(e);
            }
          }
        }

        if (this.state.dragging)
        {
          this.handleDrag(e);
        }
      },
      handleDrag: function(e)
      {
        var x = e.pageX - this.state.dragOffset.x;
        var y = e.pageY - this.state.dragOffset.y;

        var domWidth = this.state.dragPos.width || parseInt(this.DOMNode.offsetWidth);
        var domHeight = this.state.dragPos.height || parseInt(this.DOMNode.offsetHeight);

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
            left: x,
            width: this.props.makeClone ? null : this.state.dragPos.width,
            height: this.props.makeClone ? null : this.state.dragPos.height
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

        this.removeEventListeners();
      },
      handleDragEnd: function(e)
      {
        if (this.state.clone)
        {
          this.state.clone.parentNode.removeChild(this.state.clone);
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
          },
          clone: null
        });

        if (this.onDragEnd)
        {
          var endSuccesful = this.onDragEnd(e);
        }
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
        this.containerElement = document.body;
        if (this.props.containerElement)
        {
          if (this.props.containerElement.getDOMNode)
          {
            // React component
            this.containerElement = this.props.containerElement.getDOMNode();
          }
          // DOM node
          else this.containerElement = this.props.containerElement;
        }
      },
      componentWillUnmount: function()
      {
        this.removeEventListeners();
      }
    }
  }
}
