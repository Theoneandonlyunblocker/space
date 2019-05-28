import * as React from "react";


// TODO 2019.05.26 | should be "React.ComponentFactory<PropTypes, IComponent>" i think
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
  sfxEditor: React.Factory<any>;
  battleSceneTester: React.Factory<any>;
};
// tslint:enable:no-any

export type ReactUIScene = keyof UIScenes;
