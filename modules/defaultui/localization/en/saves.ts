export const saves =
{
  saveName: "Name",
  save_action: "Save",
  promptOverwrite: "Are you sure you want to overwrite '{toOverWrite}'?",
  confirmOverwrite: "Confirm overwrite",
  load_action: "Load",
  markForDeletion: "Mark for deletion",
  undoMarkForDeletion: "Undo mark for deletion",
  confirmSaveDeletion: "Are you sure you want to delete the following {count, plural," +
      "  one {save}" +
      "other {saves}" +
    "}?",
  loadGame: "Load game",
  saveSuccessful: "Succesfully saved game as '{saveName}'",
  saveFailure: "Couldn't save game",
  saveData: "Save data",
  // TODO 2018.10.06 | actually implement importing
  // saveDataCopyPrompt: "You can copy the save data for the active game below. This data can be used to import the game in the load menu after refreshing this page.",
  saveDataCopyPrompt: "You can copy the save data for the active game below. This data can be loaded back into the game by manually editing indexedDB.",
  activeGameUnserializable: "The active game is corrupt and can't be serialized. Try loading an earlier save.",
};
