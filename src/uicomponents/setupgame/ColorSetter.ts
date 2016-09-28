/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import ColorPicker from "./ColorPicker";

export interface PropTypes extends React.Props<any>
{
  setActiveColorPicker?: (colorSetter: ColorSetterComponent) => void;
  generateColor?: (toContrastWith?: Color) => Color;
  color: Color;
  onChange: (color: Color, isNull: boolean) => void;
  minUpdateBuffer?: number;
}

interface StateType
{
  isActive?: boolean;
}

export class ColorSetterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorSetter";
  state: StateType;
  ownNode: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.setAsInactive = this.setAsInactive.bind(this);
    this.getClientRect = this.getClientRect.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      isActive: false
    });
  }

  componentWillUnmount()
  {
    document.removeEventListener("click", this.handleClick);
  }

  handleClick(e: MouseEvent)
  {
    const node = ReactDOM.findDOMNode<HTMLElement>(this.ownNode);
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
    }
  }
  setAsInactive()
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
    }
  }
  updateColor(color: Color, isNull: boolean)
  {
    this.props.onChange(color, isNull);
  }

  getClientRect()
  {
    const ownNode: HTMLElement = <HTMLElement> ReactDOM.findDOMNode(this);
    const firstChild: HTMLElement = <HTMLElement> ownNode.firstChild;
    return firstChild.getBoundingClientRect();
  }

  render()
  {
    var displayElement = this.props.color === null ?
      React.DOM.img(
      {
        className: "color-setter-display",
        src: "img/icons/nullcolor.png",
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
      React.DOM.div({className: "color-setter", ref: (component: HTMLElement) =>
      {
        this.ownNode = component;
      }},
        displayElement,
        this.state.isActive ?
          ColorPicker(
          {
            hexColor: this.props.color ? this.props.color.getHex() : null,
            generateColor: this.props.generateColor,
            onChange: this.props.onChange,
            minUpdateBuffer: this.props.minUpdateBuffer,
            autoPositionerProps:
            {
              getParentClientRect: this.getClientRect,
              positionOnUpdate: true,
              ySide: "bottom",
              xSide: "left",
              positionOnResize: true
            }
          }) : null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorSetterComponent);
export default Factory;
