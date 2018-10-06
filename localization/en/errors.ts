export const errors =
{
  UIError: "UI Rendering Error",
  UIErrorDescription: "An error occurred while trying to render the user interface.",
  // could try to vary based on cause. not really useful though as we'd want stack trace anyway
  UIErrorCauseDescription: "This may have been caused by an error in the UI itself or by an underlying error in the game.",
  checkConsolePrompt: "Open the developer console on your browser for more information.",
  openConsoleInstructions: "Cmd/Ctrl+Shift+J or F12 on most desktop browsers.",
  canTryToRecoverGame: "You can try to save your current game or load a new one. (may not work)",
  errorWithGameRecovery: "An additional error occurred in the recovery process. This was probably caused by the first error.",
};
