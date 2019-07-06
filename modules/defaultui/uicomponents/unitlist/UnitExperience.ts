import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {Unit} from "../../../../src/Unit";
import {DefaultWindow} from "../windows/DefaultWindow";

import {UpgradeUnit} from "./UpgradeUnit";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  onUnitUpgrade: () => void;
  experienceForCurrentLevel: number;
  experienceToNextLevel: number;
}

interface StateType
{
  hasUpgradePopup: boolean;
}

export class UnitExperienceComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "UnitExperience";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasUpgradePopup: false,
    };

    this.bindMethods();
  }

  public render()
  {
    const rows: React.ReactHTMLElement<any>[] = [];

    const totalBars = Math.ceil(this.props.experienceToNextLevel) / 10;
    const filledBars = Math.ceil(this.props.experienceForCurrentLevel / 10);
    const lastBarWidth = (10 * (this.props.experienceForCurrentLevel % 10));

    for (let i = 0; i < totalBars; i++)
    {
      const bgProps: React.HTMLAttributes<HTMLDivElement> =
      {
        className: "unit-experience-bar-point-background",
      };
      if (i < filledBars)
      {
        bgProps.className += " filled";

        if (i === filledBars - 1 && lastBarWidth !== 0)
        {
          bgProps.style =
          {
            width: "" +  lastBarWidth + "%",
          };
        }
      }
      else
      {
        bgProps.className += " empty";
      }

      rows.push(ReactDOMElements.div(
      {
        className: "unit-experience-bar-point",
        key: "" + i,
      },
        ReactDOMElements.div(bgProps,
          null,
        ),
      ));
    }

    const isReadyToLevelUp = this.props.experienceForCurrentLevel >= this.props.experienceToNextLevel;

    const containerProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-experience-bar-container",
    };
    const barProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-experience-bar",
      title: localize("EXPReadOut")(
      {
        currentEXP: this.props.experienceForCurrentLevel,
        EXPToNextLevel: this.props.experienceToNextLevel,
      }),
    };
    if (isReadyToLevelUp)
    {
      containerProps.onClick = this.openPopup;
      containerProps.className += " ready-to-level-up";
    }

    return(
      ReactDOMElements.div(
      {
        className: "unit-experience-wrapper",
      },
        !this.state.hasUpgradePopup ? null :
        DefaultWindow(
        {
          title: localize("upgradeUnit")(),
          handleClose: this.closePopup,
          isResizable: false,
        },
          UpgradeUnit(
          {
            unit: this.props.unit,
            onUnitUpgrade: this.handleUnitUpgrade,
          }),
        ),
        ReactDOMElements.div(containerProps,
          ReactDOMElements.div(barProps,
            rows,
          ),
          !isReadyToLevelUp ? null : ReactDOMElements.span(
          {
            className: "ready-to-level-up-message",
          },
            localize("clickToLevelUp")(),
          ),
        ),
      )
    );
  }

  private bindMethods()
  {
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
  }
  private openPopup()
  {
    this.setState({hasUpgradePopup: true});
  }
  private closePopup()
  {
    this.setState({hasUpgradePopup: false});
  }
  private handleUnitUpgrade()
  {
    // unit can upgrade again
    if (this.props.unit.canLevelUp())
    {
      this.props.onUnitUpgrade();
    }
    else
    {
      this.closePopup();
    }
  }
}


export const UnitExperience: React.Factory<PropTypes> = React.createFactory(UnitExperienceComponent);
