/// <reference path="upgradeunit.ts" />

module Rance
{
  export module UIComponents
  {
    export var UnitExperience = React.createClass(
    {
      displayName: "UnitExperience",

      getInitialState: function()
      {
        return(
        {
          upgradePopupId: undefined
        });
      },
      makePopup: function()
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
              unit: this.props.unit
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
      },
      closePopup: function()
      {
        this.refs.popupManager.closePopup(this.state.upgradePopupId);
        this.setState(
        {
          upgradePopupId: undefined
        });
      },
      render: function()
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
          className: "unit-experience-bar"
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
    })
  }
}
