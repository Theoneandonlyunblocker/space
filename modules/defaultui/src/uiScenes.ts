import { CoreUIScenes } from "core/src/ui/CoreUIScenes";
import { TopLevelErrorBoundary } from "./uicomponents/errors/TopLevelErrorBoundary";
import { options } from "core/src/app/Options";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { Battle } from "./uicomponents/battle/Battle";
import { BattlePrep } from "./uicomponents/battleprep/BattlePrep";
import { GalaxyMap } from "./uicomponents/galaxymap/GalaxyMap";
import { SetupGame } from "./uicomponents/setupgame/SetupGame";
import { SaveRecoveryWithDetails } from "./uicomponents/errors/SaveRecoveryWithDetails";
import { activePlayer } from "core/src/app/activePlayer";


const coreUiScenes: CoreUIScenes =
{
  battle:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.BattleStart,
    render: (reactUi, children) => Battle(
    {
      battle: reactUi.battle,
      humanPlayer: reactUi.player,
    },
      children,
    ),
  },
  battlePrep:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.BattlePrep,
    render: (reactUi, children) => BattlePrep(
    {
      battlePrep: reactUi.battlePrep,
    },
      children,
    ),
  },
  galaxyMap:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.GameStart,
    render: (reactUi, children) => GalaxyMap(
    {
      renderer: reactUi.renderer,
      mapRenderer: reactUi.mapRenderer,
      playerControl: reactUi.playerControl,
      player: reactUi.player,
      game: reactUi.game,
      activeLanguage: options.display.language,
      notifications: [...activePlayer.notificationLog.unreadNotifications],
      notificationLog: activePlayer.notificationLog,
    },
      children,
    ),
  },
  setupGame:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.GameSetup,
    render: (reactUi, children) => SetupGame(
    {

    },
      children,
    ),
  },
  errorRecovery:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.AppInit,
    render: (reactUi, children) => SaveRecoveryWithDetails(
    {
      game: reactUi.game,
      errorMessage: reactUi.errorMessage,
    },
      children,
    ),
  },
  topLevelErrorBoundary:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.AppInit,
    render: (reactUi, children) => TopLevelErrorBoundary(
    {
      game: reactUi.game,
      errorReportingMode: options.system.errorReporting,
      errorMessage: reactUi.errorMessage,
    },
      children,
    ),
  },
};
export const uiScenes =
{
  ...coreUiScenes,
};
