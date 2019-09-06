import { ErrorReportingMode } from "core/app/ErrorReportingMode";


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
