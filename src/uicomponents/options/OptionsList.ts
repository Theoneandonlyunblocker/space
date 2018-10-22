import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import Options from "../../Options";
import eventManager from "../../eventManager";
import {Language} from "../../localization/Language";
import TutorialStatus from "../../tutorials/TutorialStatus";
import {default as AppLanguageSelect} from "../language/AppLanguageSelect";
import NotificationFilterButton from "../notifications/NotificationFilterButton";
import {default as DialogBox} from "../windows/DialogBox";

import OptionsCheckbox from "./OptionsCheckbox";
import OptionsGroup from "./OptionsGroup";
import OptionsNumericField from "./OptionsNumericField";


export interface PropTypes extends React.Props<any>
{
  activeLanguage: Language;
}

interface StateType
{
  hasConfirmResetAllDialog: boolean;
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
      headerTitle: localize("language")(),
      options: languageOptions,
    }));

    const battleAnimationOptions: any[] = [];

    const battleAnimationStages =
    [
      {
        stage: "before",
        displayName: localize("beforeAbility")(),
        min: 0,
        max: 5000,
        step: 100,
      },
      {
        stage: "effectDuration",
        displayName: localize("abilityEffectDuration")(),
        min: 0,
        max: 10,
        step: 0.1,
      },
      {
        stage: "after",
        displayName: localize("afterAbility")(),
        min: 0,
        max: 5000,
        step: 100,
      },
      {
        stage: "unitEnter",
        displayName: localize("unitEnter")(),
        min: 0,
        max: 1000,
        step: 50,
      },
      {
        stage: "unitExit",
        displayName: localize("unitExit")(),
        min: 0,
        max: 1000,
        step: 50,
      },
      {
        stage: "turnTransition",
        displayName: localize("turnTransition")(),
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
            value: Options.battle.animationTiming[stage],
            min: props.min,
            max: props.max,
            step: props.step,
            onChange: (value: number) =>
            {
              Options.battle.animationTiming[stage] = value;
              this.forceUpdate();
            },
          }),
        },
      );
    }


    allOptions.push(OptionsGroup(
    {
      key: "battleAnimationOptions",
      headerTitle: localize("battleAnimationTiming")(),
      options: battleAnimationOptions,
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
      content: OptionsCheckbox(
      {
        isChecked: Options.debug.enabled,
        label: localize("debugMode")(),
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
        key: "aiVsAiBattleSimulationDepth",
        content: ReactDOMElements.div(
        {

        },
          OptionsNumericField(
          {
            label: localize("aiVsAiBattleSimulationDepth")(),
            id: "ai-battle-simulation-depth-input",
            value: Options.debug.aiVsAiBattleSimulationDepth,
            min: 1,
            max: 500,
            step: 1,
            onChange: value =>
            {
              Options.debug.aiVsAiBattleSimulationDepth = value;
              this.forceUpdate();
            },
          }),
        ),
      },
      {
        key: "aiVsPlayerBattleSimulationDepth",
        content: ReactDOMElements.div(
        {

        },
          OptionsNumericField(
          {
            label: localize("aiVsPlayerBattleSimulationDepth")(),
            id: "player-battle-simulation-depth-input",
            value: Options.debug.aiVsPlayerBattleSimulationDepth,
            min: 1,
            max: 10000,
            step: 1,
            onChange: value =>
            {
              Options.debug.aiVsPlayerBattleSimulationDepth = value;
              this.forceUpdate();
            },
          }),
        ),
      },
      {
        key: "loggingOptions",
        content: OptionsGroup(
        {
          key: "loggingOptions",
          headerTitle: localize("logging")(),
          options: Object.keys(Options.debug.logging).map(category =>
          {
            const keyForCategory =
            {
              ai: "aiLogging",
              graphics: "graphicsLogging",
            };

            const key = keyForCategory[category];

            return(
            {
              key: key,
              content: OptionsCheckbox(
              {
                isChecked: Options.debug.logging[category],
                label: localize(key)(),
                onChangeFN: () =>
                {
                  Options.debug.logging[category] = !Options.debug.logging[category];
                  this.forceUpdate();
                },
              }),
            });
          }),
          resetFN: () =>
          {
            Options.setDefaultForCategory("debug.logging");
            this.forceUpdate();
          },
        }),
      });
    }


    allOptions.push(OptionsGroup(
    {
      key: "debug",
      headerTitle: localize("debug")(),
      options: debugOptions,
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
          isChecked: Options.display.noHamburger,
          label: localize("alwaysExpandTopRightMenuOnLowResolution")(),
          onChangeFN: () =>
          {
            Options.display.noHamburger = !Options.display.noHamburger;
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
        text: localize("messageSettings")(),
        highlightedOptionKey: null,
      }),
    });

    uiOptions.push(
    {
      key: "resetTutorials",
      content: ReactDOMElements.button(
      {
        className: "reset-tutorials-button",
        onClick: TutorialStatus.reset,
      },
        localize("resetTutorials")(),
      ),
    });

    allOptions.push(OptionsGroup(
    {
      key: "ui",
      headerTitle: localize("ui")(),
      options: uiOptions,
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
        label: localize("borderWidth")(),
        id: "options-border-width",
        min: 0,
        max: 50,
        step: 1,
        value: Options.display.borderWidth,
        onChange: (value: number) =>
        {
          Options.display.borderWidth = value;
          eventManager.dispatchEvent("renderMap");
          this.forceUpdate();
        },
      }),
    });

    allOptions.push(OptionsGroup(
    {
      key: "display",
      headerTitle: localize("display")(),
      options: displayOptions,
      resetFN: () =>
      {
        Options.setDefaultForCategory("display");
        this.forceUpdate();
      },
    }));

    return(
      ReactDOMElements.div({className: "options"},

        !this.state.hasConfirmResetAllDialog ? null :
          DialogBox(
          {
            title: localize("resetAllOptions")(),
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
          localize("areYouSureYouWantToResetAllOptions")(),
        ),

        ReactDOMElements.div({className: "options-header"},
          ReactDOMElements.button(
          {
            className: "reset-options-button reset-all-options-button",
            onClick: this.openResetAllOptionsDialog,
          },
            localize("resetAllOptions")(),
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

const factory: React.Factory<PropTypes> = React.createFactory(OptionsListComponent);
export default factory;
