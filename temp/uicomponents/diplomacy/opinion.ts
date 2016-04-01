/// <reference path="attitudemodifierlist.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class Opinion extends React.Component<PropTypes, {}>
{
  displayName: "Opinion";

  getInitialState: function()
  {
    return(
    {
      hasAttitudeModifierTootlip: false
    });
  }

  setTooltip: function()
  {
    this.setState({hasAttitudeModifierTootlip: true});
  }

  clearTooltip: function()
  {
    this.setState({hasAttitudeModifierTootlip: false});
  }

  getOpinionTextNode: function()
  {
    return this.getDOMNode().firstChild;
  }

  getColor: function()
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
  
  render: function()
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
