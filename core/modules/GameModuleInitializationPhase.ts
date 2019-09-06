export enum GameModuleInitializationPhase
{
  AppInit,
  GameSetup,
  MapGen,
  GameStart,
  BattlePrep,
  BattleStart,
}

export const allGameModuleInitializationPhases: GameModuleInitializationPhase[] =
  Object.keys(GameModuleInitializationPhase).filter(key => !isNaN(Number(key))).map(key => Number(key));
