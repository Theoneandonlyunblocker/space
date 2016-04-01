/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="upgradeunit.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitExperience extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitExperience";

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      upgradePopupId: undefined
    });
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  makePopup()
  {
    var popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.TopMenuPopup,
      contentProps:
      {
        handleClose: this.closePopup,
        contentConstructor: UIComponents.UpgradeUnit,
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
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  closePopup()
  {
    this.refs.popupManager.closePopup(this.state.upgradePopupId);
    this.setState(
    {
      upgradePopupId: undefined
    });
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleUnitUpgrade()
  {
    if (!this.props.unit.canLevelUp())
    {
      this.closePopup();
    }
    else
    {
      this.refs.popupManager.forceUpdate();
    }
    this.props.onUnitUpgrade();
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var rows: ReactDOMPlaceHolder[] = [];

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
        UIComponents.PopupManager(
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
