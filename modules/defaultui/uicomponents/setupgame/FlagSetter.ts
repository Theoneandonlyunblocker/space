import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Color} from "../../../../src/color/Color";
import {Flag} from "../../../../src/flag/Flag";
import {PlayerFlag, PlayerFlagComponent} from "../PlayerFlag";
import {DefaultWindow} from "../windows/DefaultWindow";

import {FlagEditor} from "./FlagEditor";
import {SetterComponentBase} from "./SetterComponentBase";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  mainColor: Color;
  secondaryColor: Color;
  setAsActive: (setterComponent: SetterComponentBase) => void;
  updateParentFlag: (flag: Flag) => void;
}

interface StateType
{
  isActive: boolean;
}

export class FlagSetterComponent extends React.Component<PropTypes, StateType> implements SetterComponentBase
{
  public displayName: string = "FlagSetter";
  public state: StateType;

  private readonly playerFlagContainer = React.createRef<PlayerFlagComponent>();

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
      ReactDOMElements.div(
      {
        className: "flag-setter",
      },
        PlayerFlag(
        {
          flag: this.props.flag,
          props:
          {
            className: "flag-setter-display",
            onClick: this.toggleActive,
          },
          ref: this.playerFlagContainer,
        }),
        !this.state.isActive ? null :
        ReactDOMElements.div(
        {
          className: "popup-container",
        },
          DefaultWindow(
          {
            title: localize("editFlag")(),
            handleClose: this.setAsInactive,
            isResizable: false,
            attributes: {className: "force-auto-dimensions"},
            getInitialPosition: popupRect =>
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
  public setAsInactive(): void
  {
    if (this.state.isActive)
    {
      this.setState({isActive: false});
    }
  }
  private getClientRect(): ClientRect
  {
    const flagDisplayElement = this.playerFlagContainer.current.containerElement.current;

    return flagDisplayElement.getBoundingClientRect();
  }
}

export const FlagSetter: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
