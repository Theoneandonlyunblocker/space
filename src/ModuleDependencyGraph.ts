import { ModuleInfo } from "./ModuleFile";

type Nodes<T> = {[key: string]: T};

class DependencyGraph<T>
{
  private readonly _nodes: Nodes<T> = {}; // use #getNode() instead
  private readonly children: {[key: string]: Nodes<boolean>} = {};
  private readonly parents: {[key: string]: Nodes<boolean>} = {};

  constructor()
  {

  }

  public addNode(key: string, node: T): void
  {
    this._nodes[key] = node;

    this.initKeyIfNeeded(key);
  }
  public addDependency(parentKey: string, childKey: string): void
  {
    [childKey, parentKey].forEach(nodeKey =>
    {
      this.initKeyIfNeeded(nodeKey);
    });


    this.parents[childKey][parentKey] = true;
    this.children[parentKey][childKey] = true;
  }
  public getOrderedNodes(): T[]
  {
    const startNodes = this.getIndependentNodeKeys();

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
      ordered.unshift(this.getNode(currentNodeKey));
    };

    startNodes.forEach(startNode => DFS(startNode));

    return ordered;
  }
  public getImmediateParentsOf(nodeKey: string): T[]
  {
    return Object.keys(this.parents[nodeKey]).map(parentKey => this.getNode(parentKey));
  }

  private hasKey(key: string): boolean
  {
    return Boolean(this.parents[key] || this.children[key]);
  }
  private initKeyIfNeeded(key: string): void
  {
    if (!this.hasKey(key))
    {
      this.parents[key] = {};
      this.children[key] = {};
    }
  }
  private getIndependentNodeKeys(): string[]
  {
    return Object.keys(this._nodes).filter(node => Object.keys(this.parents[node]).length === 0);
  }
  private getNode(key: string): T
  {
    const node = this._nodes[key];

    if (!node)
    {
      throw new Error(`'${key}' was listed as a dependency in dependency graph, but no node with the key '${key}' was provided.`);
    }

    return node;
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
