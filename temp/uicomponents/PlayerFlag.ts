/// <reference path="../../../lib/react-0.13.3.d.ts" />


import Flag from "../../src/Flag.ts";

import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  width?: any; // TODO refactor | define prop type 123
  props: any; // TODO refactor | define prop type 123
  isMutable?: any; // TODO refactor | define prop type 123
  height?: any; // TODO refactor | define prop type 123
  stretch?: any; // TODO refactor | define prop type 123
  flag: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class PlayerFlag_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "PlayerFlag";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.canUseDataURL = this.canUseDataURL.bind(this);    
  }
  
  canUseDataURL()
  {
    var uaString = navigator.userAgent.toLowerCase();
    var isIE = uaString.indexOf("msie") !== -1 || uaString.indexOf("trident/") !== -1;
    return !isIE;
  }
  componentDidMount()
  {
    if (this.refsTODO.container && !this.props.isMutable)
    {
      var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      React.findDOMNode<HTMLElement>(this.refsTODO.container).appendChild(canvas);
    }
  }
  componentDidUpdate()
  {
    if (this.refsTODO.container && this.props.isMutable)
    {
      var containerNode = React.findDOMNode<HTMLElement>(this.refsTODO.container);
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

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerFlag_COMPONENT_TODO);
export default Factory;
