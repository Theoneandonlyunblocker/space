import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import Color from "../../Color";
import {Flag} from "../../Flag";
import {default as PlayerFlag, PlayerFlagComponent} from "../PlayerFlag";
import {default as DefaultWindow} from "../windows/DefaultWindow";

import FlagEditor from "./FlagEditor";


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

  private playerFlagContainer = React.createRef<PlayerFlagComponent>();

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
  private setAsInactive(): void
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

const factory: React.Factory<PropTypes> = React.createFactory(FlagSetterComponent);
export default factory;
