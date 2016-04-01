/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/focustimer.ts" />

/// <reference path="colorpicker.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ColorSetter extends React.Component<PropTypes, {}>
{
  displayName: string = "ColorSetter";
  mixins: reactTypeTODO_any = [FocusTimer];
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
  
  getInitialState()
  {
    return(
    {
      hexColor: this.props.color || 0xFFFFFF,
      isNull: true,
      active: false
    });
  }

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
  
  componentWillUnmount()
  {
    document.removeEventListener("click", this.handleClick);
    this.clearFocusTimerListener();
  }

  componentWillReceiveProps(newProps: any)
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

    var node = this.refs.main.getDOMNode();
    if (e.target === node || node.contains(e.target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  }

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
  
  getClientRect()
  {
    return this.getDOMNode().firstChild.getBoundingClientRect();
  }

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
          UIComponents.ColorPicker(
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
