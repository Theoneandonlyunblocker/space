import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import eventManager from "../../../../src/eventManager";
import Options from "../../../../src/Options";
import {default as OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import OptionsNumericField from "./OptionsNumericField";
import OptionsCheckbox from "./OptionsCheckbox";


// tslint:disable-next-line:no-any
interface PropTypes extends React.Props<any>
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
          headerTitle: localize("debug")(),
          options: this.getDebugOptions(),
          resetFN: () =>
          {
            Options.setDefaultForCategory("debug");
            this.forceUpdate();
          },
        }),
        !Options.debug.enabled ? null : OptionsGroup(
        {
          key: "loggingOptions",
          headerTitle: localize("logging")(),
          options: this.getLoggingOptions(),
          resetFN: () =>
          {
            Options.setDefaultForCategory("debug.logging");
            this.forceUpdate();
          },
        })
      )
    );
  }

  private getDebugOptions(): OptionsGroupItem[]
  {
    const allOptions: OptionsGroupItem[] = this.getAlwaysVisibleDebugOptions();

    if (Options.debug.enabled)
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
          isChecked: Options.debug.enabled,
          label: localize("debugMode")(),
          onChangeFN: () =>
          {
            Options.debug.enabled = !Options.debug.enabled;
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
      },
      {
        key: "aiVsPlayerBattleSimulationDepth",
        content: OptionsNumericField(
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
      },
    ]);
  }
  private getLoggingOptions(): OptionsGroupItem[]
  {
    return Object.keys(Options.debug.logging).map(category =>
    {
      const keyForCategory =
      {
        ai: "aiLogging",
        graphics: "graphicsLogging",
        saves: "savesLogging",
        modules: "modulesLogging",
        init: "initLogging",
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
    });
  }
}

// tslint:disable-next-line:variable-name
export const DebugOptions: React.Factory<PropTypes> = React.createFactory(DebugOptionsComponent);
