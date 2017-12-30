import * as React from "react";
import * as ReactDOM from "react-dom";

import Color from "../../Color";
import {Flag} from "../../Flag";

import {default as PlayerFlag, PlayerFlagComponent} from "../PlayerFlag";
import FlagEditor from "./FlagEditor";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  mainColor: Color;
  secondaryColor: Color;
  setAsActive: (setterComponent: FlagSetterComponent) => void;
  updateParentFlag: (flag: Flag) => void;
}

interface StateType
{
  isActive: boolean;
}

export class FlagSetterComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "FlagSetter";
  public state: StateType;

  private flagSetterContainer: HTMLElement;
  private playerFlagContainer: PlayerFlagComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isActive: false,
    };

    this.setAsInactive = this.setAsInactive.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.getClientRect = this.getClientRect.bind(this);
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "flag-setter",
        ref: (component: HTMLElement) =>
        {
          this.flagSetterContainer = component;
        },
      },
        PlayerFlag(
        {
          flag: this.props.flag,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive,
          },
          ref: (component: PlayerFlagComponent) =>
          {
            this.playerFlagContainer = component;
          },
        }),
        !this.state.isActive ? null :
        React.DOM.div(
        {
          className: "popup-container",
        },
          DefaultWindow(
          {
            title: localize("editFlag")(),
            handleClose: this.setAsInactive,
            isResizable: false,
            getInitialPosition: (popupRect, containerRect) =>
            {
              const parentRect = this.getClientRect();

              return(
              {
                left: parentRect.right,
                top: parentRect.top - popupRect.height / 3,
                width: popupRect.width,
                height: popupRect.height,
              });
            },
          },
            FlagEditor(
            {
              parentFlag: this.props.flag,
              backgroundColor: this.props.mainColor,
              playerSecondaryColor: this.props.secondaryColor,

              updateParentFlag: this.props.updateParentFlag,
            }),
          ),
        ),
      )
    );
  }

  private toggleActive(): void
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
    }
  }
  private setAsInactive(): void
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
    }
  }
  private getClientRect(): ClientRect
  {
    const ownNode = <HTMLElement> ReactDOM.findDOMNode<HTMLElement>(this.playerFlagContainer);

    return ownNode.getBoundingClientRect();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
export default Factory;
