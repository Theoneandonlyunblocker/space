enum ModuleFileLoadingPhase
{
  Init,
  Setup, // game setup. map & players etc.
  MapGen,
  Game,
  BattlePrep,
  Battle,
}

export default ModuleFileLoadingPhase;
