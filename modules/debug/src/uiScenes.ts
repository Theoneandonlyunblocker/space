import { NonCoreUIScenes } from "core/src/ui/CoreUIScenes";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { FlagMaker } from "./uicomponents/FlagMaker";
import { BattleSceneTester } from "./uicomponents/BattleSceneTester";
import { VfxEditor } from "./uicomponents/vfxeditor/VfxEditor";


const nonCoreUiScenes: NonCoreUIScenes =
{
  flagMaker:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.GameSetup,
    render: (reactUi, children) => FlagMaker(
    {

    },
      children,
    ),
  },
  battleSceneTester:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.BattleStart,
    render: (reactUi, children) => BattleSceneTester(
    {

    },
      children,
    ),
  },
  vfxEditor:
  {
    requiredInitializationPhase: GameModuleInitializationPhase.BattleStart,
    render: (reactUi, children) => VfxEditor(
    {

    },
      children,
    ),
  },
};

export const uiScenes =
{
  ...nonCoreUiScenes,
};
