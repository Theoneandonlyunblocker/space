import app from "./App"; // TODO global
import {default as Options} from "./Options";


let hasAlertedOfError: boolean = false;

export type ErrorReportingMode = "ignore" | "alertOnce" | "panic";
export const errorReportingModes: ErrorReportingMode[] =
[
  "ignore",
  "alertOnce",
  "panic",
];

export const handleError: ErrorEventHandler = (message, source, lineno, colno, error) =>
{
  const handler = getErrorHandler();

  const returnValue = handler(message, source, lineno, colno, error);

  return returnValue;
};

function getErrorHandler(): ErrorEventHandler
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
  }
}
const createErrorAlert: ErrorEventHandler = (message, source, lineno, colno, error) =>
{
  // TODO 2018.10.23 | implement


  hasAlertedOfError = true;
};
const ignoreError: ErrorEventHandler = () =>
{
  return true;
};
const panicOnError: ErrorEventHandler = (message, source, lineno, colno, error) =>
{
  app.reactUI.error = error;
  app.reactUI.switchScene("errorRecovery");
};
