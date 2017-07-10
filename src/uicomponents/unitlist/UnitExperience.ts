/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";

import {default as DefaultWindow} from "../windows/DefaultWindow";

import UpgradeUnit from "./UpgradeUnit";

export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  onUnitUpgrade: () => void;
  experienceForCurrentLevel: number;
  experienceToNextLevel: number;
}

interface StateType
{
  hasUpgradePopup?: boolean;
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
      const bgProps: React.HTMLAttributes =
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

      rows.push(React.DOM.div(
      {
        className: "unit-experience-bar-point",
        key: "" + i,
      },
        React.DOM.div(bgProps,
          null,
        ),
      ));
    }

    const isReadyToLevelUp = this.props.experienceForCurrentLevel >= this.props.experienceToNextLevel;

    const containerProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar-container",
    };
    const barProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar",
      title: "" + this.props.experienceForCurrentLevel + "/" + this.props.experienceToNextLevel + " exp",
    };
    if (isReadyToLevelUp)
    {
      containerProps.onClick = this.openPopup;
      containerProps.className += " ready-to-level-up";
    }

    return(
      React.DOM.div(
      {
        className: "unit-experience-wrapper",
      },
        !this.state.hasUpgradePopup ? null :
        DefaultWindow(
        {
          title: "Upgrade unit",
          handleClose: this.closePopup,

          minWidth: 150,
          minHeight: 150,
        },
          UpgradeUnit(
          {
            unit: this.props.unit,
            onUnitUpgrade: this.handleUnitUpgrade,
          }),
        ),
        React.DOM.div(containerProps,
          React.DOM.div(barProps,
            rows,
          ),
          !isReadyToLevelUp ? null : React.DOM.span(
          {
            className: "ready-to-level-up-message",
          },
            "Click to level up",
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
    // TODO 10.07.2017 | ???
    // is this for repeat upgrades?
    if (!this.props.unit.canLevelUp())
    {
      this.closePopup();
    }
    else
    {
      this.props.onUnitUpgrade();
    }
  }
}


const Factory: React.Factory<PropTypes> = React.createFactory(UnitExperienceComponent);
export default Factory;
