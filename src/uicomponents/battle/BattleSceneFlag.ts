/// <reference path="../../../lib/react-global.d.ts" />

import {Flag} from "../../Flag";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  facingRight: boolean;
}

interface StateType
{
}

export class BattleSceneFlagComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleSceneFlag";
  flagCanvas: HTMLCanvasElement = null;


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.drawFlag = this.drawFlag.bind(this);    
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
    var DOMNode = ReactDOM.findDOMNode(this);
    if (this.flagCanvas)
    {
      DOMNode.removeChild(this.flagCanvas);
    }

    this.flagCanvas = this.drawFlag();
    ReactDOM.findDOMNode(this).appendChild(this.flagCanvas);
  }

  drawFlag()
  {
    var bounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
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

const Factory: React.Factory<PropTypes> = React.createFactory(BattleSceneFlagComponent);
export default Factory;
