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
        var parentRect = this.props.getParentNode().getBoundingClientRect();
        var ownNode = this.getDOMNode();
        var rect = ownNode.getBoundingClientRect();

        var ySide = this.props.ySide || "top";
        var xSide = this.props.xSide || "right";

        var yMargin = this.props.yMargin || 0;
        var xMargin = this.props.xMargin || 0;

        var fitsY = this.elementFitsYSide(ySide, rect, parentRect);
        if (!fitsY)
        {
          ySide = this.flipSide(ySide);
        }

        var fitsX = this.elementFitsXSide(xSide, rect, parentRect);
        if (!fitsX)
        {
          xSide = this.flipSide(xSide);
        }
        var top = null;
        var left = null;

        if (ySide === "top")
        {
          top = parentRect.top - rect.height - yMargin;
        }
        else
        {
          top = parentRect.bottom + yMargin;
        }

        if (xSide === "left")
        {
          left = parentRect.left - xMargin;
        }
        else
        {
          left = parentRect.right - rect.width + xMargin;
        }

        ownNode.style.left = "" + left + "px";
        ownNode.style.top = "" + top + "px";
      }
    }
  }
}