/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class PlayerFlag extends React.Component<PropTypes, {}>
{
  displayName: string = "PlayerFlag";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  canUseDataURL()
  {
    var uaString = navigator.userAgent.toLowerCase();
    var isIE = uaString.indexOf("msie") !== -1 || uaString.indexOf("trident/") !== -1;
    return !isIE;
  }
  componentDidMount()
  {
    if (this.refs.container && !this.props.isMutable)
    {
      var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      this.refs.container.getDOMNode().appendChild(canvas);
    }
  }
  componentDidUpdate()
  {
    if (this.refs.container && this.props.isMutable)
    {
      var containerNode = this.refs.container.getDOMNode();
      if (containerNode.firstChild)
      {
        containerNode.removeChild(containerNode.firstChild);
      }

      var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      containerNode.appendChild(canvas);
    }
  }
  render()
  {
    var props = this.props.props;
    if (this.canUseDataURL())
    {
      var flag: Flag = this.props.flag;
      props.src = flag.getCanvas(
        this.props.width, this.props.height, this.props.stretch, !this.props.isMutable).toDataURL();
      return(
        React.DOM.img(props,
          null
        )
      );
    }
    else
    {
      props.ref = "container";
      return(
        React.DOM.div(props,
          null
        )
      );
    }
  }
}
