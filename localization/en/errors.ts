export const errors =
{
  UIError: "UI Rendering Error",
  UIErrorDescription: "An error occurred while trying to render the user interface.",
  // could try to vary based on cause. not really useful though as we'd want stack trace anyway
  UIErrorCauseDescription: "This may have been caused by an error in the UI itself or by an underlying error in the game.",
  checkConsolePrompt: "Open the developer console on your browser for more information.",
  openConsoleInstructions: "Cmd/Ctrl+Shift+J or F12 on most desktop browsers.",
  canTryToRecoverGame: "You can try to save the current game or load a previous save. (Depending on how bad the first error was, neither of these may work)",
  errorWithGameRecovery: "An additional error occurred trying to render the UI for save game recovery. This was probably caused by the first error.",
};
