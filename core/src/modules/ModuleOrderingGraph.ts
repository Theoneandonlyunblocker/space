import { ModuleInfo } from "./ModuleInfo";
import { OrderedGraph } from "../generic/OrderedGraph";


export class ModuleOrderingGraph extends OrderedGraph<ModuleInfo>
{
  constructor(modules: ModuleInfo[] = [])
  {
    super();

    modules.forEach(moduleInfo => this.addModule(moduleInfo));
  }

  public addModule(moduleInfo: ModuleInfo): void
  {
    this.addNode(moduleInfo.key, moduleInfo);

    if (moduleInfo.modsThatShouldLoadAfter)
    {
      moduleInfo.modsThatShouldLoadAfter.forEach(child =>
      {
        this.addOrdering(moduleInfo.key, child);
      });
    }

    if (moduleInfo.modsThatShouldLoadBefore)
    {
      moduleInfo.modsThatShouldLoadBefore.forEach(child =>
      {
        this.addOrdering(child, moduleInfo.key);
      });
    }
  }
}
