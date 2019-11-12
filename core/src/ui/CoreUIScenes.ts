import { UIScene } from "./UIScene";
import { GameModuleInitializationPhase } from "../modules/GameModuleInitializationPhase";


export type CoreUIScenes =
{
  battle: UIScene<any, GameModuleInitializationPhase.BattleStart>;
  battlePrep: UIScene<any, GameModuleInitializationPhase.BattlePrep>;
  galaxyMap: UIScene<any, GameModuleInitializationPhase.GameStart>;
  setupGame: UIScene<any, GameModuleInitializationPhase.GameSetup>;
  errorRecovery: UIScene<any, GameModuleInitializationPhase.AppInit>;
  topLevelErrorBoundary: UIScene<any, GameModuleInitializationPhase.AppInit>;
};

export type NonCoreUIScenes = {[key: string]: UIScene<any, any>};
