import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize, AllMessages as LocalizationKeys} from "../../localization/localize";
import Options from "../../../../src/Options";
import {default as OptionsGroup, OptionsGroupItem} from "./OptionsGroup";
import { errorReportingModes, ErrorReportingMode } from "../../../../src/handleError";


const localizationKeyForErrorReportingMode:
{
  [K in ErrorReportingMode]: keyof LocalizationKeys;
} =
{
  ignore: "errorReportingMode_ignore",
  panic: "errorReportingMode_panic",
  alertOnce : "errorReportingMode_alert",
};

const localizationKeyForErrorReportingModeDescription:
{
  [K in ErrorReportingMode]: keyof LocalizationKeys;
} =
{
  ignore: "errorReportingModeDescription_ignore",
  panic: "errorReportingModeDescription_panic",
  alertOnce : "errorReportingModeDescription_alert",
};

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
          headerTitle: localize("system")(),
          options: this.getOptions(),
          resetFN: () =>
          {
            Options.setDefaultForCategory("system");
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
            value: Options.system.errorReporting,
            title: localize(localizationKeyForErrorReportingModeDescription[Options.system.errorReporting])(),
            onChange: (e) =>
            {
              const target = e.currentTarget;
              const selectedMode = <ErrorReportingMode> target.value;

              Options.system.errorReporting = selectedMode;

              this.forceUpdate();
            }
          },
            errorReportingModes.map(mode => ReactDOMElements.option(
            {
              className: "error-reporting-mode-select-item",
              value: mode,
              key: mode,
              title: localize(localizationKeyForErrorReportingModeDescription[mode])(),
            },
              localize(localizationKeyForErrorReportingMode[mode])(),
            )),
          ),
          ReactDOMElements.label(
          {
            className: "error-reporting-mode-select-label",
            htmlFor: "system-options-error-reporting-mode-select",
          },
            localize("errorReportingMode")(),
          ),
        ),
      },
    ]);
  }
}

// tslint:disable-next-line:variable-name
export const SystemOptions: React.Factory<PropTypes> = React.createFactory(SystemOptionsComponent);
