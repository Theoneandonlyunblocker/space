import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {options} from "core/src/app/Options";
import {OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import { errorReportingModes, ErrorReportingMode } from "core/src/app/ErrorReportingMode";


function localizeErrorReportingModeName(mode: ErrorReportingMode): string
{
  switch (mode)
  {
    case "ignore":    return localize("errorReportingMode_ignore").toString();
    case "panic":     return localize("errorReportingMode_panic").toString();
    case "alert":     return localize("errorReportingMode_alert").toString();
  }
}
function localizeErrorReportingModeDescription(mode: ErrorReportingMode): string
{
  switch (mode)
  {
    case "ignore":    return localize("errorReportingModeDescription_ignore").toString();
    case "panic":     return localize("errorReportingModeDescription_panic").toString();
    case "alert":     return localize("errorReportingModeDescription_alert").toString();
  }
}

// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

interface StateType
{
}

export class SystemOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SystemOptions";
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
        className: "system-options"
      },
        OptionsGroup(
        {
          headerTitle: localize("system").toString(),
          options: this.getOptions(),
          resetFN: () =>
          {
            options.setDefaultForCategory("system");
            this.forceUpdate();
          },
        }),
      )
    );
  }

  private getOptions(): OptionsGroupItem[]
  {
    return(
    [
      {
        key: "errorReporting",
        content: ReactDOMElements.div(
        {
          className: "error-reporting-mode",
        },
          ReactDOMElements.select(
          {
            className: "error-reporting-mode-select",
            id: "system-options-error-reporting-mode-select",
            value: options.system.errorReporting,
            title: localizeErrorReportingModeDescription(options.system.errorReporting),
            onChange: (e) =>
            {
              const target = e.currentTarget;
              const selectedMode = <ErrorReportingMode> target.value;

              options.system.errorReporting = selectedMode;

              this.forceUpdate();
            }
          },
            errorReportingModes.map(mode => ReactDOMElements.option(
            {
              className: "error-reporting-mode-select-item",
              value: mode,
              key: mode,
              title: localizeErrorReportingModeDescription(mode),
            },
              localizeErrorReportingModeName(mode),
            )),
          ),
          ReactDOMElements.label(
          {
            className: "error-reporting-mode-select-label",
            htmlFor: "system-options-error-reporting-mode-select",
          },
            localize("errorReportingMode").toString(),
          ),
        ),
      },
    ]);
  }
}

// tslint:disable-next-line:variable-name
export const SystemOptions: React.Factory<PropTypes> = React.createFactory(SystemOptionsComponent);
