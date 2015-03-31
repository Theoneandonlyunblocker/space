module Rance
{
  export module UIComponents
  {
    export var AutoPosition =
    {
      componentDidMount: function()
      {
        if (this.props.autoPosition)
        {
          this.setAutoPosition();
        }
      },
      componentDidUpdate: function()
      {
        if (this.props.autoPosition)
        {
          this.setAutoPosition();
        }
      },
      flipSide: function(side)
      {
        switch (side)
        {
          case "top":
          {
            return "bottom";
          }
          case "bottom":
          {
            return "top";
          }
          case "left":
          {
            return "right";
          }
          case "right":
          {
            return "left";
          }
          default:
          {
            throw new Error("Invalid side");
          }
        }
      },
      elementFitsYSide: function(side, ownRect, parentRect)
      {
        switch (side)
        {
          case "top":
          {
            return parentRect.top - ownRect.height >= 0;
          }
          case "bottom":
          {
            return parentRect.bottom + ownRect.height < window.innerHeight;
          }
          default:
          {
            throw new Error("Invalid side");
          }
        }
      },
      elementFitsXSide: function(side, ownRect, parentRect)
      {
        switch (side)
        {
          case "left":
          {
            return parentRect.left + ownRect.width < window.innerWidth;
          }
          case "right":
          {
            return parentRect.right - ownRect.width >= 0;
          }
          default:
          {
            throw new Error("Invalid side");
          }
        }
      },

      setAutoPosition: function()
      {
        /*
        try to fit prefered y
          flip if doesnt fit
        try to fit prefered x alignment
          flip if doesnt fit
         */
        var parentRect = this.getParentNode().getBoundingClientRect();
        var ownNode = this.getDOMNode();
        var rect = ownNode.getBoundingClientRect();

        var ySide = this.props.ySide;
        var xSide = this.props.xSide;

        if (!this.elementFitsYSide(ySide, rect, parentRect))
        {
          ySide = this.flipSide(ySide);
        }

        if (!this.elementFitsXSide(xSide, rect, parentRect))
        {
          xSide = this.flipSide(xSide);
        }

        var flipX = this.flipSide(xSide);
        var flipY = this.flipSide(ySide);

        ownNode.style[flipY] = "" + parentRect[ySide] + "px";
        ownNode.style[xSide] = "" + parentRect[xSide] + "px";

        ownNode.style[ySide] = null;
        ownNode.style[flipX] = null;
      }
    }
  }
}