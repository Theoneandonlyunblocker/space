/// <reference path="../../../lib/react-0.13.3.d.ts" />

import * as React from "react";

import Unit from "../../Unit.ts";
import OptionsCheckbox from "./OptionsCheckbox.ts";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager.ts";
import Options from "../../Options.ts";
import OptionsNumericField from "./OptionsNumericField.ts";
import Battle from "../battle/Battle.ts";
import OptionsGroup from "./OptionsGroup.ts";
import ConfirmPopup from "../popups/ConfirmPopup.ts";
import NotificationFilterButton from "../notifications/NotificationFilterButton.ts";
import NotificationLog from "../../NotificationLog.ts";
import eventManager from "../../eventManager.ts";
import {clamp} from "../../utility.ts";
import {resetTutorialStatus} from "../../tutorials/TutorialStatus.ts";


interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

export class OptionsListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "OptionsList";

  state: StateType;
  
  ref_TODO_popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleResetAllOptions = this.handleResetAllOptions.bind(this);    
  }
  
  handleResetAllOptions()
  {
    var confirmProps =
    {
      handleOk: () =>
      {
        Options.setDefaults();
        this.forceUpdate();
      },
      contentText: "Are you sure you want to reset all options?"
    }

    this.ref_TODO_popupManager.makePopup(
    {
      contentConstructor: ConfirmPopup,
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
    var allOptions: React.ReactElement<any>[] = [];

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
          content: OptionsNumericField(
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


    allOptions.push(OptionsGroup(
    {
      key: "battleAnimationOptions",
      header: "Battle animation timing",
      options: battleAnimationOptions,
      resetFN: () =>
      {
        Options.setDefaultForCategory("battleAnimationTiming");
        this.forceUpdate();
      }
    }));

    var debugOptions: any[] = [];
    debugOptions.push(
    {
      key: "debugMode",
      content:
        OptionsCheckbox(
        {
          isChecked: Options.debugMode,
          label: "Debug mode",
          onChangeFN: () =>
          {
            Options.debugMode = !Options.debugMode;
            this.forceUpdate();
            eventManager.dispatchEvent("renderUI");
          }
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
            onChange: (e: React.FormEvent) =>
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
            }
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


    allOptions.push(OptionsGroup(
    {
      key: "debug",
      header: "Debug",
      options: debugOptions,
      resetFN: () =>
      {
        Options.setDefaultForCategory("debugOptions");
        Options.setDefaultForCategory("debugMode");
      }
    }));

    var uiOptions: any[] = [];
    uiOptions.push(
    {
      key: "noHamburger",
      content:
        OptionsCheckbox(
        {
          isChecked: Options.ui.noHamburger,
          label: "Always expand top right menu on low resolution",
          onChangeFN: () =>
          {
            Options.ui.noHamburger = !Options.ui.noHamburger;
            eventManager.dispatchEvent("updateHamburgerMenu");
            this.forceUpdate();
          }
        })
    });

    uiOptions.push(
    {
      key: "notificationLogFilter",
      content: NotificationFilterButton(
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
        onClick: resetTutorialStatus
      },
        "Reset tutorials"
      )
    });

    allOptions.push(OptionsGroup(
    {
      key: "ui",
      header: "UI",
      options: uiOptions,
      resetFN: () =>
      {
        Options.setDefaultForCategory("ui");
      }
    }));


    var displayOptions: any[] = [];
    displayOptions.push(
    {
      key: "borderWidth",
      content: OptionsNumericField(
      {
        label: "Border width",
        id: "options-border-width",
        min: 0,
        max: 50,
        step: 1,
        value: Options.display.borderWidth,
        onChangeFN: (value: number) =>
        {
          Options.display.borderWidth = value;
          eventManager.dispatchEvent("renderMap");
        }
      })
    });

    allOptions.push(OptionsGroup(
    {
      key: "display",
      header: "Display",
      options: displayOptions,
      resetFN: () =>
      {
        Options.setDefaultForCategory("display");
        this.forceUpdate();
      }
    }));

    return(
      React.DOM.div({className: "options"},

        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.ref_TODO_popupManager = component;
          },
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

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsListComponent);
export default Factory;
