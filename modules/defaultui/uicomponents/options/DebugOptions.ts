import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {options as optionsStrings} from "../../localization/en/options";
import {eventManager} from "../../../../src/app/eventManager";
import {options} from "../../../../src/app/Options";
import {OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import {OptionsNumericField} from "./OptionsNumericField";
import {OptionsCheckbox} from "./OptionsCheckbox";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

interface StateType
{
}

export class DebugOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DebugOptions";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "debug-options"
      },
        OptionsGroup(
        {
          headerTitle: localize("debug").toString(),
          options: this.getDebugOptions(),
          resetFN: () =>
          {
            options.setDefaultForCategory("debug");
            this.forceUpdate();
          },
        }),
        !options.debug.enabled ? null : OptionsGroup(
        {
          key: "loggingOptions",
          headerTitle: localize("logging").toString(),
          options: this.getLoggingOptions(),
          resetFN: () =>
          {
            options.setDefaultForCategory("debug.logging");
            this.forceUpdate();
          },
        })
      )
    );
  }

  private getDebugOptions(): OptionsGroupItem[]
  {
    const allOptions: OptionsGroupItem[] = this.getAlwaysVisibleDebugOptions();

    if (options.debug.enabled)
    {
      allOptions.push(...this.getDebugModeOnlyDebugOptions());
    }

    return allOptions;
  }
  private getAlwaysVisibleDebugOptions(): OptionsGroupItem[]
  {
    return(
    [
      {
        key: "debugMode",
        content: OptionsCheckbox(
        {
          isChecked: options.debug.enabled,
          label: localize("debugMode").toString(),
          onChangeFN: () =>
          {
            options.debug.enabled = !options.debug.enabled;
            this.forceUpdate();
            eventManager.dispatchEvent("renderUI");
          },
        }),
      }
    ]);
  }
  private getDebugModeOnlyDebugOptions(): OptionsGroupItem[]
  {
    return(
    [
      {
        key: "aiVsAiBattleSimulationDepth",
        content: OptionsNumericField(
        {
          label: localize("aiVsAiBattleSimulationDepth").toString(),
          id: "ai-battle-simulation-depth-input",
          value: options.debug.aiVsAiBattleSimulationDepth,
          min: 1,
          max: 500,
          step: 1,
          onChange: value =>
          {
            options.debug.aiVsAiBattleSimulationDepth = value;
            this.forceUpdate();
          },
        }),
      },
      {
        key: "aiVsPlayerBattleSimulationDepth",
        content: OptionsNumericField(
        {
          label: localize("aiVsPlayerBattleSimulationDepth").toString(),
          id: "player-battle-simulation-depth-input",
          value: options.debug.aiVsPlayerBattleSimulationDepth,
          min: 1,
          max: 10000,
          step: 1,
          onChange: value =>
          {
            options.debug.aiVsPlayerBattleSimulationDepth = value;
            this.forceUpdate();
          },
        }),
      },
    ]);
  }
  private getLoggingOptions(): OptionsGroupItem[]
  {
    return Object.keys(options.debug.logging).map(category =>
    {
      const keyForCategory: {[K in keyof typeof options.debug.logging]: keyof typeof optionsStrings} =
      {
        ai: "aiLogging",
        graphics: "graphicsLogging",
        saves: "savesLogging",
        modules: "modulesLogging",
        init: "initLogging",
        ui: "uiLogging",
      };

      const key = keyForCategory[category];

      return(
      {
        key: key,
        content: OptionsCheckbox(
        {
          isChecked: options.debug.logging[category],
          label: localize(key).toString(),
          onChangeFN: () =>
          {
            options.debug.logging[category] = !options.debug.logging[category];
            this.forceUpdate();
          },
        }),
      });
    });
  }
}

// tslint:disable-next-line:variable-name
export const DebugOptions: React.Factory<PropTypes> = React.createFactory(DebugOptionsComponent);
