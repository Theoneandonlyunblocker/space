import { ErrorReportingMode } from "core/src/app/ErrorReportingMode";


export type Errors =
{
  UIErrorPanicDespiteUserPreference: [ErrorReportingMode];
  genericError: [];
  genericErrorDescription: [];
  genericErrorCauseDescription: [];
  checkConsolePrompt: [];
  openConsoleInstructions: [];
  canTryToRecoverGame: [];
  errorWithGameRecovery: [];
};
