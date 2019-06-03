import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Color from "../../../../src/Color";
import {AutoPositionerPosition} from "../mixins/AutoPositioner";

import ColorPicker from "./ColorPicker";
import {SetterComponentBase} from "./SetterComponentBase";


export interface PropTypes extends React.Props<any>
{
  setAsActive?: (setter: SetterComponentBase) => void;
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

export class ColorSetterComponent extends React.Component<PropTypes, StateType> implements SetterComponentBase
{
  public displayName = "ColorSetter";
  public state: StateType;

  private readonly ownNode = React.createRef<HTMLDivElement>();

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
      ReactDOMElements.img(
      {
        className: "color-setter-display",
        src: "img/icons/nullcolor.png",
        onClick: this.toggleActive,
      }) :
      ReactDOMElements.div(
      {
        className: "color-setter-display",
        style:
        {
          backgroundColor: "#" + this.props.color.getHexString(),
        },
        onClick: this.toggleActive,
      });

    return(
      ReactDOMElements.div(
      {
        className: "color-setter",
        ref: this.ownNode,
      },
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
    const node = this.ownNode.current;
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
    const firstChild = <HTMLElement> this.ownNode.current.firstChild;

    return firstChild.getBoundingClientRect();
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ColorSetterComponent);
export default factory;
