/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../flag.ts" />

export interface PropTypes
{
  flag: Flag;
  facingRight: boolean;
}

interface StateType
{
  // TODO refactor | add state type
}

class BattleSceneFlag extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleSceneFlag";
  flagCanvas: reactTypeTODO_any = null;


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentDidMount()
  {
    this.setFlag();

    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize()
  {
    this.setFlag();
  }

  setFlag()
  {
    var DOMNode = this.getDOMNode();
    if (this.flagCanvas)
    {
      DOMNode.removeChild(this.flagCanvas);
    }

    this.flagCanvas = this.drawFlag();
    this.getDOMNode().appendChild(this.flagCanvas);
  }

  drawFlag()
  {
    var bounds = this.getDOMNode().getBoundingClientRect();
    var width = bounds.width;

    var canvas = this.props.flag.getCanvas(width, bounds.height, true, false);
    var context = canvas.getContext("2d");
    context.globalCompositeOperation = "destination-out";

    var gradient: CanvasGradient;
    if (this.props.facingRight)
    {
      gradient = context.createLinearGradient(0, 0, width, 0);
    }
    else
    {
      gradient = context.createLinearGradient(width, 0, 0, 0);
    }

    gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, bounds.height);

    canvas.classList.add("battle-scene-start-player-flag");

    return canvas
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "battle-scene-flag-container"
      },
        null
      )
    );
  }
}
