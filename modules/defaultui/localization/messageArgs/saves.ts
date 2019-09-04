export type Saves =
{
  saveName: [];
  save_action: [];
  promptOverwrite: [{toOverWrite: string}];
  confirmOverwrite: [];
  load_action: [];
  markForDeletion: [];
  undoMarkForDeletion: [];
  confirmSaveDeletion: [{count: number}];
  loadGame: [];
  saveSuccessful: [{saveName: string}];
  saveFailure: [];
  saveData: [];
  saveDataCopyPrompt: [];
  activeGameUnserializable: [];
};
