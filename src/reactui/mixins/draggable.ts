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
        if (e.button) return;
        e.preventDefault();
        e.stopPropagation();

        if (this.state.dragging) return;

        var clientRect = this.getDOMNode().getBoundingClientRect();

        var e;
        if (isFinite(e.clientX))
        {
          e = e;
        }
        else
        {
          e = e.touches[0];
          this.needsFirstTouchUpdate = true;
          this.touchEventTarget = e.target;
        }


        this.addEventListeners();

        var dragOffset = this.props.forcedDragOffset || this.forcedDragOffset ||
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

        if (this.props.dragThreshhold <= 0)
        {
          this.handleMouseMove(e);
        }
      },
      handleMouseMove: function(e)
      {
        if (e.preventDefault) e.preventDefault();

        var e = e.clientX ? e : e.touches[0];


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
              if (!this.makeDragClone)
              {
                var nextSibling = ownNode.nextSibling;
                var clone = ownNode.cloneNode(true);
                recursiveRemoveAttribute(clone, "data-reactid");

                ownNode.parentNode.insertBefore(clone, nextSibling);
                stateObj.clone = clone;
              }
              else
              {
                var clone = this.makeDragClone();
                document.body.appendChild(clone);
                stateObj.clone = clone;
              }
            }

            this.setState(stateObj);

            if (this.onDragStart)
            {
              this.onDragStart(e);
            }
            if (this.onDragMove)
            {
              this.onDragMove(e.pageX - this.state.dragOffset.x, e.pageY - this.state.dragOffset.y);
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

        var domWidth, domHeight;

        if (this.makeDragClone)
        {
          domWidth = parseInt(this.state.clone.offsetWidth);
          domHeight = parseInt(this.state.clone.offsetHeight);
        }
        else
        {
          domWidth = parseInt(this.getDOMNode().offsetWidth);
          domHeight = parseInt(this.getDOMNode().offsetHeight);
        }

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

        if (this.onDragMove)
        {
          this.onDragMove(x, y);
        }
        else
        {
          this.setState(
          {
            dragPos:
            {
              top: y,
              left: x,
              width: this.state.dragPos.width,
              height: this.state.dragPos.height
            }
          });
        }

      },
      handleMouseUp: function(e)
      {
        if (this.touchEventTarget)
        {
          var touch = e.changedTouches[0];

          var dropTarget = getDropTargetAtLocation(touch.clientX, touch.clientY);
          console.log(dropTarget);
          if (dropTarget)
          {
            var reactid = dropTarget.getAttribute("data-reactid");
            eventManager.dispatchEvent("drop" + reactid);
          }
        }

        if (this.isMounted())
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
        }
        

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
        if (this.isMounted())
        {
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
        }

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

        if (this.touchEventTarget)
        {
          this.touchEventTarget.addEventListener("touchmove", self.handleMouseMove);
          this.touchEventTarget.addEventListener("touchend", self.handleMouseUp);
        }
      },
      removeEventListeners: function()
      {
        var self = this;
        this.containerElement.removeEventListener("mousemove", self.handleMouseMove);
        document.removeEventListener("mouseup", self.handleMouseUp);

        if (this.touchEventTarget)
        {
          this.touchEventTarget.removeEventListener("touchmove", self.handleMouseMove);
          this.touchEventTarget.removeEventListener("touchend", self.handleMouseUp);
          this.touchEventTarget = null;
        }

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
