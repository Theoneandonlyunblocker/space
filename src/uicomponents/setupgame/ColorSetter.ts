import * as React from "react";
import * as ReactDOM from "react-dom";

import Color from "../../Color";

import ColorPicker from "./ColorPicker";

import {AutoPositionerPosition} from "../mixins/AutoPositioner";


export interface PropTypes extends React.Props<any>
{
  setAsActive?: (colorSetter: ColorSetterComponent) => void;
  generateColor?: (toContrastWith?: Color) => Color;
  color: Color;
  onChange: (color: Color, isNull: boolean) => void;
  minUpdateBuffer?: number;
  position?: AutoPositionerPosition;
}

interface StateType
{
  isActive: boolean;
}

export class ColorSetterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorSetter";
  state: StateType;

  private ownNode: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isActive: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.setAsInactive = this.setAsInactive.bind(this);
    this.getClientRect = this.getClientRect.bind(this);
  }

  public componentWillUnmount()
  {
    document.removeEventListener("click", this.handleClick);
  }
  public render()
  {
    const displayElement = !this.props.color ?
      React.DOM.img(
      {
        className: "color-setter-display",
        src: "img/icons/nullcolor.png",
        onClick: this.toggleActive,
      }) :
      React.DOM.div(
      {
        className: "color-setter-display",
        style:
        {
          backgroundColor: "#" + this.props.color.getHexString(),
        },
        onClick: this.toggleActive,
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
            initialColor: this.props.color,
            generateColor: this.props.generateColor,
            onChange: this.props.onChange,
            minUpdateBuffer: this.props.minUpdateBuffer,
            isNullable: true,
            autoPositionerProps:
            {
              getParentClientRect: this.getClientRect,
              positionOnUpdate: true,
              ySide: this.props.position ? this.props.position.ySide : "outerBottom",
              xSide: this.props.position ? this.props.position.xSide : "innerLeft",
              positionOnResize: true,
            },
          }) : null,
      )
    );
  }
  public setAsInactive()
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
    }
  }

  private handleClick(e: MouseEvent)
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
  private toggleActive()
  {
    if (this.state.isActive)
    {
      this.setAsInactive();
    }
    else
    {
      if (this.props.setAsActive)
      {
        this.props.setAsActive(this);
      }
      this.setState({isActive: true});
      document.addEventListener("click", this.handleClick, false);
    }
  }
  private getClientRect()
  {
    const ownNode: HTMLElement = <HTMLElement> ReactDOM.findDOMNode(this);
    const firstChild: HTMLElement = <HTMLElement> ownNode.firstChild;
    return firstChild.getBoundingClientRect();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorSetterComponent);
export default Factory;
