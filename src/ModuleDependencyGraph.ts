import { ModuleInfo } from "./ModuleFile";

type Nodes<T> = {[key: string]: T};

class DependencyGraph<T>
{
  private readonly nodes: Nodes<T> = {};
  private readonly children: {[key: string]: Nodes<boolean>} = {};
  private readonly parents: {[key: string]: Nodes<boolean>} = {};

  constructor()
  {

  }

  public addNode(key: string, node: T): void
  {
    this.nodes[key] = node;

    if (!this.parents[key])
    {
      this.parents[key] = {};
    }
    if (!this.children[key])
    {
      this.children[key] = {};
    }
  }
  public addDependency(parentKey: string, childKey: string): void
  {
    this.parents[childKey][parentKey] = true;
    this.children[parentKey][childKey] = true;

    [childKey, parentKey].forEach(nodeKey =>
    {
      if (!this.nodes[nodeKey])
      {
        Object.defineProperty(this.nodes, nodeKey,
        {
          get: () =>
          {
            throw new Error(`'${nodeKey}' was listed as a dependency in dependency graph, but no node with the key '${nodeKey}' was provided.`);
          }
        });
      }
    });
  }
  public getOrderedNodes(): T[]
  {
    const startNodes = this.getIndependentNodes();

    const ordered: T[] = [];
    const traversed: Nodes<boolean> = {};

    const DFS = (currentNodeKey: string, takenPath: string[] = []) =>
    {
      Object.keys(this.children[currentNodeKey]).forEach(childOfCurrent =>
      {
        if (!traversed[childOfCurrent])
        {
          DFS(childOfCurrent, [...takenPath, currentNodeKey]);
        }
        else if (takenPath.indexOf(childOfCurrent) !== -1)
        {
          throw new Error(`Cyclical dependency: ${[...takenPath, childOfCurrent].join(" -> ")}`);
        }
      });

      traversed[currentNodeKey] = true;
      ordered.unshift(this.nodes[currentNodeKey]);
    };

    startNodes.forEach(startNode => DFS(startNode));

    return ordered;
  }
  public getImmediateParentsOf(nodeKey: string): T[]
  {
    return Object.keys(this.parents[nodeKey]).map(parentKey => this.nodes[parentKey]);
  }
  public getIndependentNodes(): string[]
  {
    return Object.keys(this.nodes).filter(node => Object.keys(this.parents[node]).length === 0);
  }
}

export class ModuleDependencyGraph extends DependencyGraph<ModuleInfo>
{
  constructor(modules: ModuleInfo[] = [])
  {
    super();

    modules.forEach(moduleInfo => this.addModule(moduleInfo));
  }

  public addModule(moduleInfo: ModuleInfo): void
  {
    this.addNode(moduleInfo.key, moduleInfo);

    if (moduleInfo.modsToLoadAfter)
    {
      moduleInfo.modsToLoadAfter.forEach(child =>
      {
        this.addDependency(moduleInfo.key, child);
      });
    }

    if (moduleInfo.modsToLoadBefore)
    {
      moduleInfo.modsToLoadBefore.forEach(child =>
      {
        this.addDependency(child, moduleInfo.key);
      });
    }
  }
}
