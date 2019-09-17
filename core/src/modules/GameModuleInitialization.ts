// TODO 2019.09.18 | rename file GameModuleInitializationPhase.ts
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

export type ValuesByGameModuleInitializationPhase<T> =
{
  [GameModuleInitializationPhase.AppInit]: T;
  [GameModuleInitializationPhase.GameSetup]: T;
  [GameModuleInitializationPhase.MapGen]: T;
  [GameModuleInitializationPhase.GameStart]: T;
  [GameModuleInitializationPhase.BattlePrep]: T;
  [GameModuleInitializationPhase.BattleStart]: T;
};

// TODO 2019.09.18 | move somewhere else
export type GameModuleAssetLoader = (baseUrl: string) => Promise<void>;
