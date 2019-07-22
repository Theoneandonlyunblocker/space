import * as React from "react";


// tslint:disable:no-any
export type UIScenes = {
  battle: React.Factory<any>;
  battlePrep: React.Factory<any>;
  galaxyMap: React.Factory<any>;
  setupGame: React.Factory<any>;
  errorRecovery: React.Factory<any>;
  topLevelErrorBoundary: React.Factory<any>; // for exceptions in ui that went uncaught

  // debug
  flagMaker: React.Factory<any>;
  vfxEditor: React.Factory<any>;
  battleSceneTester: React.Factory<any>;
};
// tslint:enable:no-any

export type ReactUIScene = Exclude<keyof UIScenes,
  "topLevelErrorBoundary"
>;
