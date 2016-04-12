/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/focustimer.ts" />

/// <reference path="colorpicker.ts" />


import ColorPicker from "./ColorPicker.ts";


export interface PropTypes extends React.Props<any>
{
  setActiveColorPicker: any; // TODO refactor | define prop type 123
  generateColor: any; // TODO refactor | define prop type 123
  isActive: any; // TODO refactor | define prop type 123
  color: any; // TODO refactor | define prop type 123
  flagHasCustomImage: any; // TODO refactor | define prop type 123
  onChange: any; // TODO refactor | define prop type 123
}

interface StateType
{
  isNull?: any; // TODO refactor | define state type 456
  hexColor?: any; // TODO refactor | define state type 456
  isActive?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  main: HTMLElement;
}

class ColorSetter_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorSetter";
  mixins: reactTypeTODO_any = [FocusTimer];
  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.setAsInactive = this.setAsInactive.bind(this);
    this.getClientRect = this.getClientRect.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      hexColor: this.props.color || 0xFFFFFF,
      isNull: true,
      active: false
    });
  }

  componentWillUnmount()
  {
    document.removeEventListener("click", this.handleClick);
    this.clearFocusTimerListener();
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.color !== this.state.hexColor)
    {
      this.setState(
      {
        hexColor: newProps.color,
        isNull: newProps.color === null
      });
    }
  }

  handleClick(e: MouseEvent)
  {
    var focusGraceTime = 500;
    if (Date.now() - this.lastFocusTime <= focusGraceTime) return;

    var node = React.findDOMNode<HTMLElement>(this.refsTODO.main);
    if (e.target === node || node.contains(e.target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  }

  toggleActive()
  {
    if (this.state.isActive)
    {
      this.setAsInactive();
    }
    else
    {
      if (this.props.setActiveColorPicker)
      {
        this.props.setActiveColorPicker(this);
      }
      this.setState({isActive: true});
      document.addEventListener("click", this.handleClick, false);
      this.registerFocusTimerListener();
    }
  }
  setAsInactive()
  {
    if (this.isMounted() && this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
      this.clearFocusTimerListener();
    }
  }
  updateColor(hexColor: number, isNull: boolean)
  {
    if (isNull)
    {
      this.setState({isNull: isNull});
    }
    else
    {
      this.setState({hexColor: hexColor, isNull: isNull});
    }

    if (this.props.onChange)
    {
      this.props.onChange(hexColor, isNull);
    }
  }

  getClientRect()
  {
    return React.findDOMNode(this).firstChild.getBoundingClientRect();
  }

  render()
  {
    var displayElement = this.state.isNull ?
      React.DOM.img(
      {
        className: "color-setter-display",
        src: "img\/icons\/nullcolor.png",
        onClick: this.toggleActive
      }) :
      React.DOM.div(
      {
        className: "color-setter-display",
        style:
        {
          backgroundColor: "#" + hexToString(this.state.hexColor)
        },
        onClick: this.toggleActive
      });

    return(
      React.DOM.div({className: "color-setter", ref: "main"},
        displayElement,
        this.props.isActive || this.state.isActive ?
          ColorPicker(
          {
            hexColor: this.state.hexColor,
            generateColor: this.props.generateColor,
            onChange: this.updateColor,
            setAsInactive: this.setAsInactive,
            flagHasCustomImage: this.props.flagHasCustomImage,
            getParentPosition: this.getClientRect
          }) : null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorSetter_COMPONENT_TODO);
export default Factory;
