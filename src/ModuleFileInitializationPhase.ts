export enum ModuleFileInitializationPhase
{
  AppInit,
  GameSetup,
  MapGen,
  GameStart,
  BattlePrep,
  BattleStart,
}

export const allModuleFileInitializationPhases: ModuleFileInitializationPhase[] =
  Object.keys(ModuleFileInitializationPhase).filter(key => !isNaN(Number(key))).map(key => Number(key));
