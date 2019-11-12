import { ReactElement, ReactNode } from "react";
import { GameModuleInitializationPhase } from "../modules/GameModuleInitializationPhase";
import { ReactUI } from "./ReactUI";


export type UIScene<T extends ReactElement<any> = any, InitializationPhase extends GameModuleInitializationPhase = any> =
{
  render: (reactUi: ReactUI, ...children: ReactNode[]) => T;
  requiredInitializationPhase: InitializationPhase;
};
