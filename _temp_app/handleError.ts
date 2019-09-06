import {app} from "core/app/App"; // TODO global
import {options} from "core/app/Options";


let hasAlertedOfError: boolean = false;

export const handleError: OnErrorEventHandlerNonNull = (message, source, lineno, colno, error) =>
{
  const handler = getErrorHandler();

  const returnValue = handler(message.toString());

  return returnValue;
};

export const handleRejection: ((ev: PromiseRejectionEvent) => any) = (ev) =>
{
  return handleError(ev.reason);
}

function getErrorHandler(): (errorMessage: string) => void
{
  const errorReportingMode = options && options.system ?
    options.system.errorReporting :
    undefined;

  switch (errorReportingMode)
  {
    case "ignore":
    {
      return ignoreError;
    }
    case "alert":
    {
      return createErrorAlert;
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
const createErrorAlert = (message: string) =>
{
  // TODO 2018.10.23 | implement


  hasAlertedOfError = true;
};
const ignoreError: OnErrorEventHandlerNonNull = () =>
{
  return true;
};
const panicOnError = (message: string) =>
{
  if (app && app.reactUI)
  {
    app.reactUI.triggerError(message);
  }
  else
  {
    document.body.append(
      `Uncaught error:`,
      document.createElement("br"),
      `${message}`,
    );
  }
};
