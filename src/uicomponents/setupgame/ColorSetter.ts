/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import Color from "../../Color";
import ColorPicker from "./ColorPicker";

import {default as FocusTimer, FocusTimerProps} from "../mixins/FocusTimer";
import applyMixins from "../mixins/applyMixins";

interface PropTypes extends React.Props<any>
{
  setActiveColorPicker: (colorSetter: ColorSetterComponent) => void;
  generateColor: (toContrastWith?: Color) => Color;
  color: Color;
  flagHasCustomImage: boolean;
  onChange: (color: Color, isNull: boolean) => void;
  
  focusTimerProps?: FocusTimerProps;
}

interface StateType
{
  isActive?: boolean;
}

export class ColorSetterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorSetter";
  state: StateType;
  ref_TODO_main: React.HTMLComponent;
  isMounted: boolean = false;
  focusTimer: FocusTimer<ColorSetterComponent>;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.focusTimer = new FocusTimer(this);
    applyMixins(this, this.focusTimer);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.setAsInactive = this.setAsInactive.bind(this);
    this.getClientRect = this.getClientRect.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      isActive: false
    });
  }
  
  componentDidMount()
  {
    this.isMounted = true;
  }

  componentWillUnmount()
  {
    this.isMounted = false;
    document.removeEventListener("click", this.handleClick);
    this.focusTimer.clearListener();
  }

  handleClick(e: MouseEvent)
  {
    if (this.focusTimer.isWithinGracePeriod()) return;

    const node = React.findDOMNode<HTMLElement>(this.ref_TODO_main);
    const target = <HTMLElement> e.target;
    if (target === node || node.contains(target))
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
      this.focusTimer.registerListener();
    }
  }
  setAsInactive()
  {
    if (this.isMounted && this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
      this.focusTimer.clearListener();
    }
  }
  updateColor(color: Color, isNull: boolean)
  {
    this.props.onChange(color, isNull);
  }

  getClientRect()
  {
    const ownNode: HTMLElement = <HTMLElement> React.findDOMNode(this);
    const firstChild: HTMLElement = <HTMLElement> ownNode.firstChild;
    return firstChild.getBoundingClientRect();
  }

  render()
  {
    var displayElement = this.props.color === null ?
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
          backgroundColor: "#" + this.props.color.getHexString()
        },
        onClick: this.toggleActive
      });

    return(
      React.DOM.div({className: "color-setter", ref: (component: React.HTMLComponent) =>
      {
        this.ref_TODO_main = component;
      }},
        displayElement,
        this.state.isActive ?
          ColorPicker(
          {
            hexColor: this.props.color.getHex(),
            generateColor: this.props.generateColor,
            onChange: this.props.onChange,
            // setAsInactive: this.setAsInactive,
            flagHasCustomImage: this.props.flagHasCustomImage,
            getParentPosition: this.getClientRect
          }) : null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorSetterComponent);
export default Factory;
