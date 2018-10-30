export const errors =
{
  UIErrorPanicDespiteUserPreference: "This was an uncaught exception while rendering the UI. The entire UI has been forced to unmount despite error handling preference being set to '{0}'.",
  genericError: "Error",
  genericErrorDescription: "An error has occurred in the game.",
  genericErrorCauseDescription: "This is probably due to a simple programming oversight in the game and shouldn't cause any damage that can't be fixed by reloading this page. The error may keep happening though.",
  checkConsolePrompt: "Open the developer console on your browser for more information.",
  openConsoleInstructions: "Cmd/Ctrl+Shift+J or F12 on most desktop browsers.",
  canTryToRecoverGame: "You can try to save the current game or load a previous save. (Depending on how bad the first error was, neither of these may work)",
  errorWithGameRecovery: "An additional error occurred trying to render the UI for save game recovery. This was probably caused by the same thing as the first error.",
};
