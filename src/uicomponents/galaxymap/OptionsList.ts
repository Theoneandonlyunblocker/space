/// <reference path="../../../lib/react-global.d.ts" />

import NotificationLog from "../../NotificationLog";
import Options from "../../Options";
import eventManager from "../../eventManager";
import TutorialStatus from "../../tutorials/TutorialStatus";
import {clamp} from "../../utility";

import {Language} from "../../localization/Language";

import NotificationFilterButton from "../notifications/NotificationFilterButton";

import {default as DialogBox} from "../windows/DialogBox";

import {default as AppLanguageSelect} from "../language/AppLanguageSelect";

import OptionsCheckbox from "./OptionsCheckbox";
import OptionsGroup from "./OptionsGroup";
import OptionsNumericField from "./OptionsNumericField";


export interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  activeLanguage: Language;
}

interface StateType
{
  hasConfirmResetAllDialog?: boolean;
}

export class OptionsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "OptionsList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasConfirmResetAllDialog: false,
    };

    this.bindMethods();
  }

  public render()
  {
    const allOptions: React.ReactElement<any>[] = [];

    const languageOptions: any[] = [];

    languageOptions.push(
    {
      key: "selectAppLanguage",
      content: AppLanguageSelect(
      {
        activeLanguage: this.props.activeLanguage,
      }),
    });

    allOptions.push(OptionsGroup(
    {
      key: "language",
      header: "Language",
      options: languageOptions,
      activeLanguage: this.props.activeLanguage,
    }));

    const battleAnimationOptions: any[] = [];

    const battleAnimationStages =
    [
      {
        stage: "before",
        displayName: "Before ability (ms)",
        min: 0,
        max: 5000,
        step: 100,
      },
      {
        stage: "effectDuration",
        displayName: "Ability effect duration (*)",
        min: 0,
        max: 10,
        step: 0.1,
      },
      {
        stage: "after",
        displayName: "After ability (ms)",
        min: 0,
        max: 5000,
        step: 100,
      },
      {
        stage: "unitEnter",
        displayName: "Unit enter (ms)",
        min: 0,
        max: 1000,
        step: 50,
      },
      {
        stage: "unitExit",
        displayName: "Unit exit (ms)",
        min: 0,
        max: 1000,
        step: 50,
      },
      {
        stage: "turnTransition",
        displayName: "Turn transition (ms)",
        min: 0,
        max: 2000,
        step: 100,
      },
    ];
    for (let i = 0; i < battleAnimationStages.length; i++)
    {
      const props = battleAnimationStages[i];
      const stage = props.stage;

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
            }.bind(null, stage),
          }),
        },
      );
    }


    allOptions.push(OptionsGroup(
    {
      key: "battleAnimationOptions",
      header: "Battle animation timing",
      options: battleAnimationOptions,
      activeLanguage: this.props.activeLanguage,
      resetFN: () =>
      {
        Options.setDefaultForCategory("battleAnimationTiming");
        this.forceUpdate();
      },
    }));

    const debugOptions: any[] = [];
    debugOptions.push(
    {
      key: "debugMode",
      content:
        OptionsCheckbox(
        {
          isChecked: Options.debug.enabled,
          label: "Debug mode",
          onChangeFN: () =>
          {
            Options.debug.enabled = !Options.debug.enabled;
            this.forceUpdate();
            eventManager.dispatchEvent("renderUI");
          },
        }),
    });

    if (Options.debug.enabled)
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
            value: "" + Options.debug.battleSimulationDepth,
            min: 1,
            max: 500,
            step: 1,
            onChange: (e: React.FormEvent) =>
            {
              const target = <HTMLInputElement> e.target;
              let value = parseInt(target.value);
              if (!isFinite(value))
              {
                return;
              }
              value = clamp(value, parseFloat(target.min), parseFloat(target.max));
              Options.debug.battleSimulationDepth = value;
              this.forceUpdate();
            },
          }),
          React.DOM.label(
          {
            htmlFor: "battle-simulation-depth-input",
          },
            "AI vs. AI Battle simulation depth",
          ),
        ),
      });
    }


    allOptions.push(OptionsGroup(
    {
      key: "debug",
      header: "Debug",
      options: debugOptions,
      activeLanguage: this.props.activeLanguage,
      resetFN: () =>
      {
        Options.setDefaultForCategory("debug");
        this.forceUpdate();
      },
    }));

    const uiOptions: any[] = [];
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
          },
        }),
    });

    uiOptions.push(
    {
      key: "notificationLogFilter",
      content: NotificationFilterButton(
      {
        filter: this.props.log.notificationFilter,
        text: "Message settings",
        highlightedOptionKey: null,
        activeLanguage: this.props.activeLanguage,
      }),
    });

    uiOptions.push(
    {
      key: "resetTutorials",
      content: React.DOM.button(
      {
        className: "reset-tutorials-button",
        onClick: TutorialStatus.reset,
      },
        "Reset tutorials",
      ),
    });

    allOptions.push(OptionsGroup(
    {
      key: "ui",
      header: "UI",
      options: uiOptions,
      activeLanguage: this.props.activeLanguage,
      resetFN: () =>
      {
        Options.setDefaultForCategory("ui");
      },
    }));


    const displayOptions: any[] = [];
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
        },
      }),
    });

    allOptions.push(OptionsGroup(
    {
      key: "display",
      header: "Display",
      options: displayOptions,
      activeLanguage: this.props.activeLanguage,
      resetFN: () =>
      {
        Options.setDefaultForCategory("display");
        this.forceUpdate();
      },
    }));

    return(
      React.DOM.div({className: "options"},

        !this.state.hasConfirmResetAllDialog ? null :
          DialogBox(
          {
            title: "Reset all options",
            handleOk: () =>
            {
              Options.setDefaults();
              this.closeResetAllOptionsDialog();
            },
            handleCancel: () =>
            {
              this.closeResetAllOptionsDialog();
            },
          },
          "Are you sure you want to reset all options?",
        ),

        React.DOM.div({className: "options-header"},
          React.DOM.button(
          {
            className: "reset-options-button reset-all-options-button",
            onClick: this.openResetAllOptionsDialog,
          },
            "Reset all options",
          ),
        ),
        allOptions,
      )
    );
  }

  private bindMethods()
  {
    this.openResetAllOptionsDialog = this.openResetAllOptionsDialog.bind(this);
    this.closeResetAllOptionsDialog = this.closeResetAllOptionsDialog.bind(this);
  }
  private openResetAllOptionsDialog()
  {
    this.setState(
    {
      hasConfirmResetAllDialog: true,
    });
  }
  private closeResetAllOptionsDialog()
  {
    this.setState(
    {
      hasConfirmResetAllDialog: false,
    });
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsListComponent);
export default Factory;
