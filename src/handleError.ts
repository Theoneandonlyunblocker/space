import {app} from "./App"; // TODO global
import {default as Options} from "./Options";


let hasAlertedOfError: boolean = false;

export type ErrorReportingMode = "ignore" | "alertOnce" | "panic";
export const errorReportingModes: ErrorReportingMode[] =
[
  "ignore",
  "alertOnce",
  "panic",
];

export const handleError: OnErrorEventHandlerNonNull = (message, source, lineno, colno, error) =>
{
  const handler = getErrorHandler();

  const returnValue = handler(message, source, lineno, colno, error);

  return returnValue;
};

function getErrorHandler(): OnErrorEventHandlerNonNull
{
  switch (Options.system.errorReporting)
  {
    case "ignore":
    {
      return ignoreError;
    }
    case "alertOnce":
    {
      if (hasAlertedOfError)
      {
        return ignoreError;
      }
      else
      {
        return createErrorAlert;
      }
    }
    case "panic":
    {
      return panicOnError;
    }
    default:
    {
      // TODO 2018.11.13 | could do custom error here

      return panicOnError;
    }
  }
}
const createErrorAlert: OnErrorEventHandlerNonNull = (message, source, lineno, colno, error) =>
{
  // TODO 2018.10.23 | implement


  hasAlertedOfError = true;
};
const ignoreError: OnErrorEventHandlerNonNull = () =>
{
  return true;
};
const panicOnError: OnErrorEventHandlerNonNull = (message, source, lineno, colno, error) =>
{
  app.reactUI.error = error;
  app.reactUI.switchScene("errorRecovery");
};
