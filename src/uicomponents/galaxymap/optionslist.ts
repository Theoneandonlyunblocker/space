/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="optionsgroup.ts"/>
/// <reference path="optionscheckbox.ts" />

module Rance
{
  export module UIComponents
  {
    export var OptionsList = React.createClass(
    {
      displayName: "OptionsList",

      makeBattleAnimationOption: function(stage: string)
      {
        if (!isFinite(Options.battleAnimationTiming[stage]))
        {
          console.warn("Invalid option", stage);
          return;
        }

        var onChangeFN = function(e: Event)
        {
          var target = <HTMLInputElement> e.target;
          var value = parseFloat(target.value);
          if (!isFinite(value))
          {
            return;
          }
          value = clamp(value, parseFloat(target.min), parseFloat(target.max));
          Options.battleAnimationTiming[stage] = value;
          this.forceUpdate();
        }.bind(this);

        var key = "battle-animation-option-" + stage;

        return(
        {
          key: stage,
          content: React.DOM.div(
          {

          },
            React.DOM.input(
            {
              type: "number",
              id: key,
              value: Options.battleAnimationTiming[stage],
              min: 0,
              max: 10,
              step: 0.1,
              onChange: onChangeFN
            }),
            React.DOM.label(
            {
              htmlFor: key
            },
              stage
            )
          )
        });

      },

      handleResetAllOptions: function()
      {
        var resetFN = function()
        {
          var shouldToggleDebug = false;
          if (Options.debugMode !== defaultOptions.debugMode) shouldToggleDebug = true;
          Options = extendObject(defaultOptions);
          this.forceUpdate();

          if (shouldToggleDebug)
          {
            app.reactUI.render();
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
          contentProps: confirmProps
        });
      },

      render: function()
      {
        var allOptions: ReactComponentPlaceHolder[] = [];

        // battle animation timing
        var battleAnimationOptions: any[] = [];
        for (var stage in Options.battleAnimationTiming)
        {
          battleAnimationOptions.push(this.makeBattleAnimationOption(stage));
        }
        allOptions.push(UIComponents.OptionsGroup(
        {
          header: "Battle animation timing",
          options: battleAnimationOptions,
          resetFN: function()
          {
            extendObject(defaultOptions.battleAnimationTiming, Options.battleAnimationTiming);
            this.forceUpdate();
          }.bind(this),
          key: "battleAnimationOptions"
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
                value: Options.debugOptions.battleSimulationDepth,
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
          }.bind(this),
          key: "debug"
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

        allOptions.push(UIComponents.OptionsGroup(
        {
          header: "UI",
          options: uiOptions,
          resetFN: function()
          {
            extendObject(defaultOptions.ui, Options.ui);
            this.forceUpdate();
          }.bind(this),
          key: "ui"
        }));


        var displayOptions: any[] = [];
        displayOptions.push(
        {
          key: "borderWidth",
          content: React.DOM.div(
          {

          },
            React.DOM.input(
            {
              type: "number",
              id: "border-width-input",
              value: Options.display.borderWidth,
              min: 0,
              max: 50,
              step: 1,
              onChange: function(e: Event)
              {
                var target = <HTMLInputElement> e.target;
                var value = parseFloat(target.value);
                if (!isFinite(value))
                {
                  return;
                }
                value = clamp(value, parseFloat(target.min), parseFloat(target.max));
                Options.display.borderWidth = value;
                eventManager.dispatchEvent("renderMap");
                this.forceUpdate();
              }.bind(this)
            }),
            React.DOM.label(
            {
              htmlFor: "border-width-input"
            },
              "Border width"
            )
          )
        });

        allOptions.push(UIComponents.OptionsGroup(
        {
          header: "Display",
          options: displayOptions,
          resetFN: function()
          {
            extendObject(defaultOptions.display, Options.display);
            eventManager.dispatchEvent("renderMap");
            this.forceUpdate();
          }.bind(this),
          key: "display"
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
    });
  }
}