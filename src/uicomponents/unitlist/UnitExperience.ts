/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import TopMenuPopup from "../popups/TopMenuPopup";
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
  upgradePopupId?: number;
}

export class UnitExperienceComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitExperience";

  state: StateType;
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      upgradePopupId: undefined,
    });
  }
  makePopup()
  {
    var popupId = this.popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        handleClose: this.closePopup,
        content: UpgradeUnit(
        {
          unit: this.props.unit,
          onUnitUpgrade: this.handleUnitUpgrade,
        }),
      }),
      popupProps:
      {
        dragPositionerProps:
        {
          preventAutoResize: true,
          containerDragOnly: true,
        },
      },
    });

    this.setState(
    {
      upgradePopupId: popupId,
    });
  }
  closePopup()
  {
    this.popupManager.closePopup(this.state.upgradePopupId);
    this.setState(
    {
      upgradePopupId: undefined,
    });
  }
  handleUnitUpgrade()
  {
    if (!this.props.unit.canLevelUp())
    {
      this.closePopup();
    }
    else
    {
      this.popupManager.forceUpdate();
    }
    this.props.onUnitUpgrade();
  }
  render()
  {
    var rows: React.ReactHTMLElement<any>[] = [];

    var totalBars = Math.ceil(this.props.experienceToNextLevel) / 10;
    var filledBars = Math.ceil(this.props.experienceForCurrentLevel / 10);
    var lastBarWidth = (10 * (this.props.experienceForCurrentLevel % 10));

    for (let i = 0; i < totalBars; i++)
    {
      var bgProps: React.HTMLAttributes =
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
          }
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
      ))
    }

    var isReadyToLevelUp = this.props.experienceForCurrentLevel >= this.props.experienceToNextLevel;

    var containerProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar-container",
    }
    var barProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar",
      title: "" + this.props.experienceForCurrentLevel + "/" + this.props.experienceToNextLevel + " exp",
    }
    if (isReadyToLevelUp)
    {
      containerProps.onClick = this.makePopup;
      containerProps.className += " ready-to-level-up"
    }

    return(
      React.DOM.div(
      {
        className: "unit-experience-wrapper",
      },
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true,
        }),
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
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitExperienceComponent);
export default Factory;
