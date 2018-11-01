enum ModuleFileInitializationPhase
{
  Init,
  Setup, // game setup. map & players etc.
  MapGen,
  Game,
  BattlePrep,
  Battle,
}

export default ModuleFileInitializationPhase;
