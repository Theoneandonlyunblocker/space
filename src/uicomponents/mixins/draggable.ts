/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

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
          dragging: false,
          clone: <Node> null
        });
      },
      componentWillMount: function()
      {
        this.dragPos = {};
        this.mouseDown = false;
        this.dragOffset =
        {
          x: 0,
          y: 0
        };
        this.mouseDownPosition =
        {
          x: 0,
          y: 0
        };
        this.originPosition =
        {
          x: 0,
          y: 0
        };
      },
      componentDidMount: function()
      {
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

        this.setContainerRect();
        window.addEventListener("resize", this.setContainerRect, false);
      },
      componentWillUnmount: function()
      {
        this.removeEventListeners();
        window.removeEventListener("resize", this.setContainerRect);
      },
      handleMouseDown: function(e: MouseEvent)
      {
        if (e.button) return;
        if (this.props.containerDragOnly)
        {
          var target = <HTMLElement> e.target;
          if (!target.classList.contains("draggable-container"))
          {
            return;
          }
        }
        e.preventDefault();
        e.stopPropagation();

        if (this.state.dragging) return;

        var clientRect = this.getDOMNode().getBoundingClientRect();

        // var e;
        // if (isFinite(e.clientX))
        // {
        //   e = e;
        // }
        // else
        // {
        //   e = e.touches[0];
        //   this.needsFirstTouchUpdate = true;
        //   this.touchEventTarget = e.target;
        // }

        this.addEventListeners();

        var dragOffset = this.props.forcedDragOffset || this.forcedDragOffset ||
        {
          x: e.clientX - clientRect.left,
          y: e.clientY - clientRect.top
        };

        this.mouseDown = true;
        this.dragOffset = dragOffset;
        this.mouseDownPosition =
        {
          x: e.pageX,
          y: e.pageY
        };
        this.originPosition =
        {
          x: clientRect.left + document.body.scrollLeft,
          y: clientRect.top + document.body.scrollTop
        }

        if (this.props.dragThreshhold <= 0)
        {
          this.handleMouseMove(e);
        }
      },
      handleMouseMove: function(e: MouseEvent)
      {
        if (e.preventDefault) e.preventDefault();

        // var e = e.clientX ? e : e.touches[0];


        if (e.clientX === 0 && e.clientY === 0) return;


        if (!this.state.dragging)
        {
          var deltaX = Math.abs(e.pageX - this.mouseDownPosition.x);
          var deltaY = Math.abs(e.pageY - this.mouseDownPosition.y);

          var delta = deltaX + deltaY;


          if (delta >= this.props.dragThreshhold)
          {
            var ownNode = this.getDOMNode();

            var stateObj: any =
            {
              dragging: true
            }
            if (!this.props.preventAutoResize)
            {
              this.dragPos.width = parseInt(ownNode.offsetWidth);
              this.dragPos.height = parseInt(ownNode.offsetHeight);
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
              this.onDragMove(e.pageX - this.dragOffset.x, e.pageY - this.dragOffset.y);
            }
          }
        }

        if (this.state.dragging)
        {
          this.handleDrag(e);
        }
      },
      handleDrag: function(e: MouseEvent)
      {
        var x = e.pageX - this.dragOffset.x;
        var y = e.pageY - this.dragOffset.y;

        var domWidth: number, domHeight: number;

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

        var minX = this.containerRect.left;
        var maxX = this.containerRect.right;
        var minY = this.containerRect.top;
        var maxY = this.containerRect.bottom;

        var x2 = x + domWidth;
        var y2 = y + domHeight;

        if (x < minX)
        {
          x = minX;
        }
        else if (x2 > maxX)
        {
          x = this.containerRect.width - domWidth;
        };

        if (y < minY)
        {
          y = minY;
        }
        else if (y2 > maxY)
        {
          y = this.containerRect.height - domHeight;
        };

        if (this.onDragMove)
        {
          this.onDragMove(x, y);
        }
        else
        {
          this.dragPos.top = y;
          this.dragPos.left = x;
          this.updateDOMNodeStyle();
        }

      },
      handleMouseUp: function(e: MouseEvent)
      {
        // if (this.touchEventTarget)
        // {
        //   var touch = e.changedTouches[0];

        //   var dropTarget = getDropTargetAtLocation(touch.clientX, touch.clientY);
        //   console.log(dropTarget);
        //   if (dropTarget)
        //   {
        //     var reactid = dropTarget.getAttribute("data-reactid");
        //     eventManager.dispatchEvent("drop" + reactid);
        //   }
        // }


        this.mouseDown = false;
        this.mouseDownPosition =
        {
          x: 0,
          y: 0
        }

        if (this.state.dragging)
        {
          this.handleDragEnd(e);
        }

        this.removeEventListeners();
      },
      handleDragEnd: function(e: MouseEvent)
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
            clone: null
          });
          this.dragOffset =
          {
            x: 0,
            y: 0
          };
          this.originPosition =
          {
            x: 0,
            y: 0
          };
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
      setContainerRect: function()
      {
        this.containerRect = this.containerElement.getBoundingClientRect();
      },
      updateDOMNodeStyle: function()
      {
        if (this.state.clone)
        {
          var s = this.state.clone.style;
          s.top = "" + this.dragPos.top + "px";
          s.left = "" + this.dragPos.left + "px";
        }
        else
        {
          var s = this.DOMNode.style;
          for (var key in this.dragPos)
          {
            s[key] = "" + this.dragPos[key] + "px";
          }
        }
      }
    }
  }
}
