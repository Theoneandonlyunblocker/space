/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="upgradeunit.ts" />


import UpgradeUnit from "./UpgradeUnit.ts";
import TopMenuPopup from "../popups/TopMenuPopup.ts";
import PopupManager from "../popups/PopupManager.ts";


interface PropTypes extends React.Props<any>
{
  unit: any; // TODO refactor | define prop type 123
  onUnitUpgrade: any; // TODO refactor | define prop type 123
  experienceForCurrentLevel: any; // TODO refactor | define prop type 123
  experienceToNextLevel: any; // TODO refactor | define prop type 123
}

interface StateType
{
  upgradePopupId?: any; // TODO refactor | define state type 456
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

export class UnitExperienceComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitExperience";

  state: StateType;
  refsTODO: RefTypes;

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
    var popupId = this.refsTODO.popupManager.makePopup(
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
    this.refsTODO.popupManager.closePopup(this.state.upgradePopupId);
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
      this.refsTODO.popupManager.forceUpdate();
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
      var bgProps: any =
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

    var containerProps: any =
    {
      className: "unit-experience-bar-container"
    }
    var barProps: any =
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
          ref: "popupManager",
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
