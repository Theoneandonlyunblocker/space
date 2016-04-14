/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

/// <reference path="upgradeunit.ts" />


import UpgradeUnit from "./UpgradeUnit";
import TopMenuPopup from "../popups/TopMenuPopup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import Unit from "../../Unit";

interface PropTypes extends React.Props<any>
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
  ref_TODO_popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      upgradePopupId: undefined
    });
  }
  makePopup()
  {
    var popupId = this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: UpgradeUnit,
        contentProps:
        {
          unit: this.props.unit,
          onUnitUpgrade: this.handleUnitUpgrade
        }
      },
      popupProps:
      {
        preventAutoResize: true,
        containerDragOnly: true
      }
    });

    this.setState(
    {
      upgradePopupId: popupId
    });
  }
  closePopup()
  {
    this.ref_TODO_popupManager.closePopup(this.state.upgradePopupId);
    this.setState(
    {
      upgradePopupId: undefined
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
      this.ref_TODO_popupManager.forceUpdate();
    }
    this.props.onUnitUpgrade();
  }
  render()
  {
    var rows: React.HTMLElement[] = [];

    var totalBars = Math.ceil(this.props.experienceToNextLevel) / 10;
    var filledBars = Math.ceil(this.props.experienceForCurrentLevel / 10);
    var lastBarWidth = (10 * (this.props.experienceForCurrentLevel % 10));

    for (var i = 0; i < totalBars; i++)
    {
      var bgProps: React.HTMLAttributes =
      {
        className: "unit-experience-bar-point-background"
      };
      if (i < filledBars)
      {
        bgProps.className += " filled";

        if (i === filledBars - 1 && lastBarWidth !== 0)
        {
          bgProps.style =
          {
            width: "" +  lastBarWidth + "%"
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
        key: "" + i
      },
        React.DOM.div(bgProps,
          null
        )
      ))
    }

    var isReadyToLevelUp = this.props.experienceForCurrentLevel >= this.props.experienceToNextLevel;

    var containerProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar-container"
    }
    var barProps: React.HTMLAttributes =
    {
      className: "unit-experience-bar",
      title: "" + this.props.experienceForCurrentLevel + "/" + this.props.experienceToNextLevel + " exp"
    }
    if (isReadyToLevelUp)
    {
      containerProps.onClick = this.makePopup;
      barProps.className += " ready-to-level-up"
    }

    return(
      React.DOM.div(
      {
        className: "unit-experience-wrapper"
      },
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.ref_TODO_popupManager = component;
          },
          onlyAllowOne: true
        }),
        React.DOM.div(containerProps,
          React.DOM.div(barProps,
            rows
          ),
          !isReadyToLevelUp ? null : React.DOM.span(
          {
            className: "ready-to-level-up-message"
          },
            "Click to level up"
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitExperienceComponent);
export default Factory;
