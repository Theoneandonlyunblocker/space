/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="attitudemodifierlist.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class Opinion extends React.Component<PropTypes, StateType>
{
  displayName: string = "Opinion";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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

  getOpinionTextNode()
  {
    return this.getDOMNode().firstChild;
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
    var tooltip: ReactComponentPlaceHolder = null;
    if (this.state.hasAttitudeModifierTootlip)
    {
      tooltip = UIComponents.AttitudeModifierList(
      {
        attitudeModifiers: this.props.attitudeModifiers,
        baseOpinion: this.props.baseOpinion,
        onLeave: this.clearTooltip,
        
        getParentNode: this.getOpinionTextNode,
        autoPosition: true,
        ySide: "top",
        xSide: "right",
        yMargin: 10
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

const Factory: React.Factory<PropTypes> = React.createFactory(Opinion);
export default Factory;
