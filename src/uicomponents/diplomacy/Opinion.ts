/// <reference path="../../../lib/react-global.d.ts" />

import AttitudeModifierList from "./AttitudeModifierList";
import AttitudeModifier from "../../AttitudeModifier";
import
{
  clamp,
  getRelativeValue,
} from "../../utility";

export interface PropTypes extends React.Props<any>
{
  attitudeModifiers: AttitudeModifier[];
  baseOpinion: number;
  opinion: number;
}

interface StateType
{
  hasAttitudeModifierTootlip?: boolean;
}

export class OpinionComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Opinion";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.getColor = this.getColor.bind(this);
    this.getOpinionTextNodeRect = this.getOpinionTextNodeRect.bind(this);
    this.setTooltip = this.setTooltip.bind(this);
    this.clearTooltip = this.clearTooltip.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      hasAttitudeModifierTootlip: false
    });
  }

  setTooltip()
  {
    this.setState({hasAttitudeModifierTootlip: true});
  }

  clearTooltip()
  {
    this.setState({hasAttitudeModifierTootlip: false});
  }

  getOpinionTextNodeRect()
  {
    const firstChild = <HTMLElement> ReactDOM.findDOMNode<HTMLElement>(this).firstChild
    return firstChild.getBoundingClientRect();
  }

  getColor()
  {
    var relativeValue = getRelativeValue(this.props.opinion, -30, 30);
    relativeValue = clamp(relativeValue, 0, 1);

    var deviation = Math.abs(0.5 - relativeValue) * 2;

    var hue = 110 * relativeValue;
    var saturation = 0 + 50 * deviation;
    if (deviation > 0.3) saturation += 40;
    var lightness = 70 - 20 * deviation;

    return(
      "hsl(" +
        hue + "," +
        saturation + "%," +
        lightness + "%)"
    );
  }
  
  render()
  {
    var tooltip: React.ReactElement<any> = null;
    if (this.state.hasAttitudeModifierTootlip)
    {
      tooltip = AttitudeModifierList(
      {
        attitudeModifiers: this.props.attitudeModifiers,
        baseOpinion: this.props.baseOpinion,
        
        autoPositionerProps:
        {
          getParentClientRect: this.getOpinionTextNodeRect,
          positionOnUpdate: true,
          ySide: "outerTop",
          xSide: "outerRight",
          yMargin: 10
        }
      });
    }
    return(
      React.DOM.div(
      {
        className: "player-opinion",
        onMouseEnter: this.setTooltip,
        onMouseLeave: this.clearTooltip
      },
        React.DOM.span(
        {
          style:
          {
            color: this.getColor()
          }
        },
          this.props.opinion
        ),
        tooltip
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OpinionComponent);
export default Factory;
