/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="../notifications/notificationfilterbutton.ts" />
/// <reference path="optionsgroup.ts"/>
/// <reference path="optionscheckbox.ts" />
/// <reference path="optionsnumericfield.ts" />

/// <reference path="../../notificationlog.ts" />

export interface PropTypes
{
  log: NotificationLog;
}

export default class OptionsList extends React.Component<PropTypes, {}>
{
  displayName: string = "OptionsList";


  state:
  {
    
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
  
  handleResetAllOptions()
  {
    var resetFN = function()
    {
      var shouldToggleDebug = (Options.debugMode !== defaultOptions.debugMode);
      var shouldRenderMap = Options.display.borderWidth !== defaultOptions.display.borderWidth;

      Options = extendObject(defaultOptions);
      this.forceUpdate();

      if (shouldToggleDebug)
      {
        app.reactUI.render();
      }
      if (shouldRenderMap)
      {
        eventManager.dispatchEvent("renderMap");
      }
    }.bind(this);

    var confirmProps =
    {
      handleOk: resetFN,
      contentText: "Are you sure you want to reset all options?"
    }

    this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.ConfirmPopup,
      contentProps: confirmProps,
      popupProps:
      {
        containerDragOnly: true,
        preventAutoResize: true
      }
    });
  }

  render()
  {
    var allOptions: ReactComponentPlaceHolder[] = [];

    // battle animation timing
    var battleAnimationOptions: any[] = [];

    var battleAnimationStages =
    [
      {
        stage: "before",
        displayName: "Before ability (ms)",
        min: 0,
        max: 5000,
        step: 50
      },
      {
        stage: "effectDuration",
        displayName: "Ability effect duration (*)",
        min: 0,
        max: 10,
        step: 0.1
      },
      {
        stage: "after",
        displayName: "After ability (ms)",
        min: 0,
        max: 5000,
        step: 50
      },
      {
        stage: "unitEnter",
        displayName: "Unit enter (ms)",
        min: 0,
        max: 1000,
        step: 10
      },
      {
        stage: "unitExit",
        displayName: "Unit exit (ms)",
        min: 0,
        max: 1000,
        step: 10
      }
    ];
    for (var i = 0; i < battleAnimationStages.length; i++)
    {
      var props = battleAnimationStages[i];
      var stage = props.stage;

      battleAnimationOptions.push(
        {
          key: stage,
          content: UIComponents.OptionsNumericField(
          {
            label: props.displayName,
            id: "options-battle-animation-" + stage,
            value: Options.battleAnimationTiming[stage],
            min: props.min,
            max: props.max,
            step: props.step,
            onChangeFN: function(stage: string, value: number)
            {
              Options.battleAnimationTiming[stage] = value;
            }.bind(null, stage)
          })
        }
      );
    }


    allOptions.push(UIComponents.OptionsGroup(
    {
      key: "battleAnimationOptions",
      header: "Battle animation timing",
      options: battleAnimationOptions,
      resetFN: function()
      {
        extendObject(defaultOptions.battleAnimationTiming, Options.battleAnimationTiming);
        this.forceUpdate();
      }.bind(this)
    }));

    var debugOptions: any[] = [];
    debugOptions.push(
    {
      key: "debugMode",
      content:
        UIComponents.OptionsCheckbox(
        {
          isChecked: Options.debugMode,
          label: "Debug mode",
          onChangeFN: function()
          {
            Options.debugMode = !Options.debugMode;
            this.forceUpdate();
            app.reactUI.render();
          }.bind(this)
        })
    });

    if (Options.debugMode)
    {
      debugOptions.push(
      {
        key: "battleSimulationDepth",
        content: React.DOM.div(
        {

        },
          React.DOM.input(
          {
            type: "number",
            id: "battle-simulation-depth-input",
            value: "" + Options.debugOptions.battleSimulationDepth,
            min: 1,
            max: 500,
            step: 1,
            onChange: function(e: Event)
            {
              var target = <HTMLInputElement> e.target;
              var value = parseInt(target.value);
              if (!isFinite(value))
              {
                return;
              }
              value = clamp(value, parseFloat(target.min), parseFloat(target.max));
              Options.debugOptions.battleSimulationDepth = value;
              this.forceUpdate();
            }.bind(this)
          }),
          React.DOM.label(
          {
            htmlFor: "battle-simulation-depth-input"
          },
            "AI vs. AI Battle simulation depth"
          )
        )
      });
    }


    allOptions.push(UIComponents.OptionsGroup(
    {
      key: "debug",
      header: "Debug",
      options: debugOptions,
      resetFN: function()
      {
        extendObject(defaultOptions.debugOptions, Options.debugOptions);
        if (Options.debugMode !== defaultOptions.debugMode)
        {
          Options.debugMode = !Options.debugMode;
          this.forceUpdate();
          app.reactUI.render();
        }
      }.bind(this)
    }));

    var uiOptions: any[] = [];
    uiOptions.push(
    {
      key: "noHamburger",
      content:
        UIComponents.OptionsCheckbox(
        {
          isChecked: Options.ui.noHamburger,
          label: "Always expand top right menu on low resolution",
          onChangeFN: function()
          {
            Options.ui.noHamburger = !Options.ui.noHamburger;
            eventManager.dispatchEvent("updateHamburgerMenu");
            this.forceUpdate();
          }.bind(this)
        })
    });

    uiOptions.push(
    {
      key: "notificationLogFilter",
      content: UIComponents.NotificationFilterButton(
      {
        filter: this.props.log.notificationFilter,
        text: "Message settings",
        highlightedOptionKey: null
      })
    });

    uiOptions.push(
    {
      key: "resetTutorials",
      content: React.DOM.button(
      {
        className: "reset-tutorials-button",
        onClick: Rance.resetTutorialState
      },
        "Reset tutorials"
      )
    });

    allOptions.push(UIComponents.OptionsGroup(
    {
      key: "ui",
      header: "UI",
      options: uiOptions,
      resetFN: function()
      {
        extendObject(defaultOptions.ui, Options.ui);
        this.forceUpdate();
      }.bind(this)
    }));


    var displayOptions: any[] = [];
    displayOptions.push(
    {
      key: "borderWidth",
      content: UIComponents.OptionsNumericField(
      {
        label: "Border width",
        id: "options-border-width",
        min: 0,
        max: 50,
        step: 1,
        value: Options.display.borderWidth,
        onChangeFN: function(value: number)
        {
          Options.display.borderWidth = value;
          eventManager.dispatchEvent("renderMap");
        }
      })
    });

    allOptions.push(UIComponents.OptionsGroup(
    {
      key: "display",
      header: "Display",
      options: displayOptions,
      resetFN: function()
      {
        extendObject(defaultOptions.display, Options.display);
        eventManager.dispatchEvent("renderMap");
        this.forceUpdate();
      }.bind(this)
    }));

    return(
      React.DOM.div({className: "options"},

        UIComponents.PopupManager(
        {
          ref: "popupManager",
          onlyAllowOne: true
        }),

        React.DOM.div({className: "options-header"},
          "Options",
          React.DOM.button(
          {
            className: "reset-options-button reset-all-options-button",
            onClick: this.handleResetAllOptions
          },
            "Reset all options"
          )
        ),
        allOptions
      )
    );
  }
}
