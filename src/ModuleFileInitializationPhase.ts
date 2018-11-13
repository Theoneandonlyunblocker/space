enum ModuleFileInitializationPhase
{
  AppInit,
  GameSetup,
  MapGen,
  GameStart,
  BattlePrep,
  BattleStart,
}

export default ModuleFileInitializationPhase;
export const allModuleFileInitializationPhases: ModuleFileInitializationPhase[] =
  Object.keys(ModuleFileInitializationPhase).filter(key => !isNaN(Number(key))).map(key => Number(key));
